---
title: A Baby monitor Kotlin app using HMS ML Kit sound detection
summary: >-
  A Baby monitor Kotlin app using Jetpack Compose and HMS ML Kit sound detection
date: '2021-04-13'
draft: false
categories: []
images: ['/static/images/newborn.jpeg']
tags: ['ML Kit', 'HMS ML Kit', 'Sound detection', 'Jetpack Compose']
---

![](https://miro.medium.com/max/1050/1*fnzmK5179yDbBckSAxfNeQ.jpeg)
Photo by <a href="https://unsplash.com/@tjsocoz?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Tim Bish</a> on <a href="https://unsplash.com/s/photos/newborn-crying?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>

Adding complex features to a mobile app is becoming easier and easier. In the years We saw a lot of SDKs, libraries and utilities
to help us as developers fulfil the trickiest needs of our users.

Years ago I could not imagine how difficult could it be to develop something like a Baby Monitor app for our smartphone.
Something activating the microphone and automatically recognizing the crying sound of a baby and generating effects,
like sending a notification, maybe playing a song or other more useful features.

Today We have Machine Learning, yes, we could train a model to recognize a baby crying, with the assumption to have a good quantity and quality of data of crying newborns.
Then deploy this model in our app, choose some library to better interface with it, design a good UI, and then choose a good library to develop that UI most practically and reliably.

Without any knowledge of ML and as an Android developer today we can use 2 nice tools to do this job.

## The tools

First of all the UI. We are Android developers of the new roaring 20s, We don't want to use XML anymore and go back and forth from Kotlin to it. We deserve an easy way to define our UI and to test it. We deserve [Jetpack Compose](https://developer.android.com/jetpack/compose)

To detect the baby crying We can use the services offered by Huawei Mobile Services ( HMS ) ML Kit (https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides/sound-detection-0000001055282786)
In the specific, this offers the on-devices recognition of up to 12 different sounds:

- LAUGHTER
- BABY CRY
- SNORING
- SNEEZE
- SCREAMING
- MEOW
- BARK
- WATER
- CAR ALARM
- DOORBELL
- KNOCK
- ALARM
- STEAM WHISTLE

So now that We have it all, let's see how to build it.

## Let's build it

The first step is to add the dependency of the Huawei repository in the project Gradle file

```groovy
    repositories {
        google()
        mavenCentral()
        maven { url "https://developer.huawei.com/repo/" }
    }
```

and the same line in the settings.gradle dependency area.

Then we can add the effective dependency of the HMS ML Kit sound detection just by adding these line to the build.gradle files

```groovy
    implementation 'com.huawei.hms:ml-speech-semantics-sounddect-model:2.1.0.300'
    implementation 'com.huawei.hms:ml-speech-semantics-sounddect-sdk:2.1.0.300'
```

## The HMS ML Kit Sound Recognizer

The Sound detection provided by HMS ML KIT can recognize up to 12 different kinds of sounds.
To use it We have to initialize the SoundDetector

```kotlin
    var mlSoundDetector: MLSoundDector = MLSoundDector.createSoundDector()
```

then assign to the detector a listener

```kotlin
 mlSoundDetector.setSoundDectListener(object : MLSoundDectListener {
            override fun onSoundSuccessResult(result: Bundle) {
                TODO("Do something with the result")
            }

            override fun onSoundFailResult(errCode: Int) {
                TODO("houston we have a problem")
            }
        })
```

This listener has 2 callbacks: onSoundSuccessResult and onSoundFailResult. These will be called respectively
if a sound is recognized or if an error is raised.

After We set up all this, the recognizer is ready to start.

To start it use this API

```kotlin
    mlSoundDetector.start(context)
```

to stop it

```kotlin
   mlSoundDetector.stop()
```

## Let's use the SoundDetector

In our sample, I've created a class SoundDetector initializing the recognizer and handling the callbacks as lambda.
This class also help to not store a context in the ViewModel class as the one injected at the start will be used to call the start API.
So no context is saved and we can use the setCallbacks method to assign the desired actions of the listener.

```kotlin
class SoundDetector(private val context: Context) {
    var mlSoundDetector: MLSoundDector = MLSoundDector.createSoundDector()

    fun startDetection() {
        mlSoundDetector.start(context)
    }

    fun stopDetection() {
        mlSoundDetector.stop()
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

## A Straightforward UI - No XML were harmed during this process

The UI of this sample project is pretty simple, a centred Card showing an icon of the command We can launch by tapping it.
So at the first start, We will see an ear icon, tap it and the detector will start listening. The card will expand to show a circular progress indicator and the ear icon
will change into a strikethrough-ed ear that can be tapped to stop listening.

From the moment the detector is running if the crying of the baby is detected, the progress indicator will disappear and an image of a crying baby will be shown instead.

Thining about this UI in Jetpack compose we can assume is based on a Card that contains a Column with the DetectorStatus ( the ear icon ) and the DetectionStatus ( the actual detected sound icon or the progress indicator)
The Card could be expanded, and this behaviour will be managed by the expanded state changed by the tapping of the DetectorStatus composable.

Let's see this in code:

```kotlin
Box(contentAlignment = Alignment.Center) {
            Card {
                var expanded by remember { mutableStateOf(false) }

                Column {

                    DetectorStatus(state, Modifier.clickable {
                        if (state.isDetectorRunning) stopTimer() else startTimer()
                        expanded = !expanded
                    })

                    DetectionStatus(state = state, expanded = expanded)
                }
            }
        }
```

![](https://miro.medium.com/max/786/1*KGOBvc2u63V0cBWKRTyOog.gif)

Now we can focus on the other 2 UI composable elements.

## DetectorStatus

The DetectorStatus ( the ear ) is a composable reacting to the state of the SoundDetector
showing the right image of the command the user can launch.

```kotlin
@Composable
private fun DetectorStatus(state: State, modifier: Modifier) {
        if (state.isDetectorRunning) {
            Image(
                painterResource(R.drawable.notlistening),
                contentDescription = null,
                modifier = modifier.size(128.dp, 128.dp)
            )
        } else {
            Image(
                painterResource(R.drawable.listening),
                contentDescription = null,
                modifier = modifier.size(128.dp, 128.dp)
            )
        }
}
```

## DetectionStatus

The DetectionStatus is a composable reacting to the result of the detector. If there is still no detection a CircularProgressIndicator is shown otherwise
a DetectedSound is shown

```kotlin
 if (state.detectedSound == null) {
    CircularProgressIndicator(Modifier.size(64.dp, 64.dp))
 } else {
    DetectedSound(state.detectedSound)
 }
```

## DetectedSound

The DetectedSound is a composable reacting to the detected sound event coming and showing the correspondent image on the screen. A Baby crying or (Bonus Point!) a Knock Knock Knocking on the door :)

```kotlin
@Composable
fun DetectedSound(detectedSoundEvent: SoundEvent?) {
    when (detectedSoundEvent) {
        SoundEvent.KNOCK -> {
            Image(
                painterResource(R.drawable.knock),
                contentDescription = null
            )
        }
        SoundEvent.BABY_CRY -> {
            Image(
                painterResource(R.drawable.cry),
                contentDescription = null
            )
        }
        else -> {
        }
    }
}
```

## The Result

And this is the final result, from the gif we cannot hear the baby crying but
![](https://miro.medium.com/max/900/1*OCvAsMtxzmSVb3d4UOrZbQ.gif)
If you want to give it a try you can found the source code of this app on [Github](https://github.com/joaobiriba/SoundDetector)

See you next time!
