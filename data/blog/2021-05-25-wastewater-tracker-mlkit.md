---
title: Wastewater tracking app with HMS ML Kit sound detection and Jetpack Compose
summary: >-
  A Wastewater Kotlin app using Jetpack Compose and Machine Learning
date: '2021-05-25'
draft: false
categories: []
images: ['/static/images/wastewater.jpg']
tags: ['ML Kit', 'HMS ML Kit', 'Sound detection', 'Jetpack Compose']
---

![](https://miro.medium.com/max/400/1*0cZsEegZs_yLQj30pkj1Gg.jpeg)
Photo by <a href="https://unsplash.com/@dylu?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Jacek Dylag</a> on <a href="https://unsplash.com/s/photos/tap-water?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

Water is a finite resource and we should be aware to not waste it.

It’s estimated that the average American uses about 575 litres of water a day, while the average European uses around 250 litres of water.
Can you imagine how much is 250 litres?

Imagine a room filled with 250 of those big one litre bottles!

Sometimes is hard to figure out how much water we are wasting with simple gestures and habits.

With the help of current technologies, we can quickly increase this awareness.
I’ve developed a demo app using Machine Learning to detect when water is running and giving an estimation of how many litres we are consuming.
It’s should not be considered as a perfect tracker as many variables are in the game, like how much water runs through your tap every second or if there are any leaks in the system.

But it can help to give us a rough idea.

## The App

This app UI is based on a trivial design:

Just one button, a counter and a water animation.

Tapping on the button will enable or disable the listening for water running.

The component for the button is very similar to the approach used for

[A Baby monitor Kotlin app using HMS ML Kit sound detection](https://laquidara.dev/blog/2021-04-13-baby-monitor-mlkit)

If running water is detected we will see a cool animation of water raising from the bottom of the screen to the top and an increasing counter, representing how many litres we are consuming.

When the water has stopped the animation and the counter will pause until maybe the water is running again or we decide to stop listening tapping the button again.

## Water detection

To detect the sound of the water running I’ve used [HMS ML Kit](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides/sound-detection-0000001055282786). This SDK has the interesting feature enabling detection of common sounds, among these, there is the Water Running sound.

The code using the HMS ML Kit capabilities are enclosed in the [SoundDetector](https://github.com/joaobiriba/WaterTracker/blob/main/app/src/main/java/com/laquysoft/watertracker/SoundDetector.kt) class

```kotlin
package com.laquysoft.watertracker

import android.content.Context
import android.os.Bundle
import com.huawei.hms.mlsdk.sounddect.MLSoundDectListener
import com.huawei.hms.mlsdk.sounddect.MLSoundDector

class SoundDetector(private val context: Context) {
    var mlSoundDetector: MLSoundDector = MLSoundDector.createSoundDector()

    fun startDetection() {
        mlSoundDetector.start(context)
    }

    fun stopDetection() {
        mlSoundDetector.stop()
    }

    fun isRunning(): Boolean {
        return mlSoundDetector.isAudioDetecting
    }

    fun setCallbacks(
        onSuccess: (Bundle) -> Unit = {},
        onError: (Int) -> Unit = {}
    ) {
        mlSoundDetector.setSoundDectListener(object : MLSoundDectListener {
            override fun onSoundSuccessResult(result: Bundle) {
                onSuccess(result)
            }

            override fun onSoundFailResult(errCode: Int) {
                onError(errCode)
            }
        })
    }
}
```

If you need more info about the API of HMS ML Kit Sound Detections you can refer to this article :
[A Baby monitor Kotlin app using HMS ML Kit sound detection](https://laquidara.dev/blog/2021-04-13-baby-monitor-mlkit)

and the official documentation:
[HMS ML Kit Sound Detection](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides/sound-detection-0000001055282786)

At the moment this framework does not raise any event if the sound is not listened to anymore, so to identify this kind of event I’ve used a system of timeouts:

Every time the running water is detected we stop the detector and we will enable it to check again in X seconds ( You can configure these parameters as you prefer)

We assume that during this wait the water is still running, choosing a good time parameter can make us achieve a good estimation.

When the detector is started again if it does not detect any water after Y seconds we can assume the water has been stopped and we pause the counter and the animation, waiting for the water to be detected again.

This system designed in this way has a little “inertia” to perceive when the water is stopped but it is compensated by the detection time to detected the water running as the SDK needs 6/7 seconds to understand that effectively the water is started.

The time is started from the first time when the running water is detected and every second we modify the counters and check the condition to update the UI

```kotlin
   fun startTimer() {
        stop(timeState.value!!)
        job = viewModelScope.launch(Dispatchers.IO) {
            while (isActive) {
                updateLiters()
                waitForWater()
                sleepDetectorOrRestart()
                delay(1_000)
            }
        }
    }
```

```kotlin
 private fun updateLiters() {
        if (isWaterRunning.value == true) {
            timeState.postValue((timeState.value!! + 1))
        }
    }

    private fun waitForWater() {
        if (soundDetector.isRunning() && waterDetectedCountdown > 0) {
            Log.i("ViewModel", "waiting for water $waterDetectedCountdown")
            waterDetectedCountdown--
        }
        if (waterDetectedCountdown == 0) {
            _isWaterRunning.postValue(false)
            Log.i("ViewModel", "water is not running anymore")
        }
    }

    private fun sleepDetectorOrRestart() {
        if (sleepCountdown > 0) {
            sleepCountdown--
            Log.i("ViewModel", "listen again in $sleepCountdown")
        } else if (!soundDetector.isRunning()) {
            startDetection()
            Log.i("ViewModel", "start water detection")
        }
    }
```

## The UI composition

To implement the UI part, I’ve used [Jetpack Compose](https://developer.android.com/jetpack/compose), because Who wants to touch XML again to build beautiful UIs :) ?

The main UI is just composed of a Box containing the composable of the Counter (Text), the Button (DetectorStatus) and the Water animation (TimeWave)

```kotlin
@ExperimentalAnimationApi
@Composable
fun MainUI(timePackViewModel: MainViewModel) {
    val playPauseState = remember { mutableStateOf(true) }

    val isWaterRunning by timePackViewModel.isWaterRunning.observeAsState(false)
    val timeSpec by timePackViewModel.timeState.observeAsState(0)

    Box(
        modifier = Modifier.fillMaxSize()
    ) {

        Text(
            text = String.format("%.2f Liters", timeSpec * 0.08),
            fontWeight = FontWeight.Bold,
            color = Green200,
            fontSize = 30.sp,
            modifier = Modifier.align(Alignment.Center)
        )

        TimeWave(
            isWaterRunning,
            playPauseState.value,
            modifier = Modifier
                .fillMaxSize()
        )

        DetectorStatus(
            playPauseState.value,
            Modifier
                .align(Alignment.TopCenter)
                .padding(32.dp)
        ) {
            if (playPauseState.value) {
                playPauseState.value = false
                timePackViewModel.startDetection()
            } else {
                playPauseState.value = true
                timePackViewModel.stopDetection()
            }
        }
    }
}
```

In depth, to create the water animation part we’ve used the API to draw on the Canvas using the same idea of [Julien Salvi](https://juliensalvi.medium.com/).

If you are interested in how can we use Jetpack Compose and the Canvas API I suggest you read his article:

[Exploring Jetpack Compose Canvas](https://medium.com/google-developer-experts/exploring-jetpack-compose-canvas-the-power-of-drawing-8cc60815babe)

The TimeWave composable in this case is just modified to draw two waves using 2 paths in the canvas animated as waves and translating them from the bottom of the screen to the top, gradually, if the running water is detected

```kotlin
@Composable
fun TimeWave(
    isWaterRunning: Boolean,
    init: Boolean,
    modifier: Modifier
) {
    if (!init) {
        val waveColor = Blue400
        val deltaXAnim = rememberInfiniteTransition()
        val dx by deltaXAnim.animateFloat(
            initialValue = 0f,
            targetValue = 1f,
            animationSpec = infiniteRepeatable(
                animation = tween(1000, easing = LinearEasing)
            )
        )

        val screenHeightPx = with(LocalDensity.current) {
            (LocalConfiguration.current.screenHeightDp * density) - 150.dp.toPx()
        }

        val waveHeight = 125f
        val waveWidth = 2000
        val originalY = 150f
        val path = Path()

        val animTranslate by animateFloatAsState(
            targetValue = if (isWaterRunning) 0f else screenHeightPx,
            animationSpec = TweenSpec(
                durationMillis = if (isWaterRunning) 50000 else Int.MAX_VALUE,
                easing = LinearEasing
            )
        )

        Canvas(
            modifier = modifier.fillMaxSize(),
            onDraw = {
                translate(top = animTranslate) {
                    drawWave(path, waveColor, waveWidth, dx, originalY, waveHeight)
                    drawWave(path, waveColor, waveWidth - 500, dx, originalY, waveHeight - 200)
                }
            }
        )
    }
}
```

## Conclusion

That’s a wrap, if you need the complete source code you can check it here:

[Github WaterTracker repository](https://github.com/joaobiriba/WaterTracker)

<iframe src='https://gfycat.com/ifr/PastGeneralJackal' frameborder='0' scrolling='no' allowfullscreen width='640' height='1181'></iframe>
