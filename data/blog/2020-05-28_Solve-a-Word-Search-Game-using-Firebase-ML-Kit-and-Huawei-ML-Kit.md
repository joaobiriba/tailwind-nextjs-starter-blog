---
title: Solve a Word Search Game using Firebase ML Kit and Huawei ML Kit
summary: >-
  Allow your users the freedom to choose their Android platform providing the
  same feature
date: '2020-05-28'
draft: true
categories: []
tags: ['ML Kit', 'HMS ML Kit', 'WordSearch', 'trie']
slug: >-
  /@joaolaq/solve-a-word-search-game-using-firebase-ml-kit-and-huawei-ml-kit-8b9cc06bf4ce
---

![](https://cdn-images-1.medium.com/max/800/1*4z44q3MnDaeoyK30qFzK0g.jpeg)

Some time ago I developed a Word Search game solver Android application using the services from Firebase ML Kit.

[**Solve WordSearch games with Android and ML Kit**  
\_A Kotlin ML Kit Data Structure & Algorithm Story_proandroiddev.com](https://proandroiddev.com/solve-wordsearch-games-with-android-and-ml-kit-34cf9a9ee30e 'https://proandroiddev.com/solve-wordsearch-games-with-android-and-ml-kit-34cf9a9ee30e')[](https://proandroiddev.com/solve-wordsearch-games-with-android-and-ml-kit-34cf9a9ee30e)

It was an interesting trip discovering the features of a framework that allows the developer to use AI capabilities without knowing all the rocket science behind.

In the specific, I’ve used the Document recognition feature to try to extract text from a word search game image.

After the text recognition phase, the output was cleaned and arranged into a matrix to be processed by the solver algorithm. This algo tried to look for all the words formed by grouping the letters respecting the rules of the games: contiguous letters in all the straight directions (vertical, horizontal, diagonal)

This app ran well on all the Android devices capable to run the Google Firebase SDK and the Google Mobile Services (GMS).

Since the second half of last year all new Huawei devices cannot run the GMS any more due to government restrictions, you can read more about this here:

[**\[Update 14: Temporary License Extended Again\] Google has revoked Huawei's Android license**  
\_Update 14 (03/11/2020 @ 09:40 AM ET): The Trump Administration has once again extended Huawei's temporary license, but…\_www.xda-developers.com](https://www.xda-developers.com/google-revoke-huawei-android-ban-blacklist/ 'https://www.xda-developers.com/google-revoke-huawei-android-ban-blacklist/')[](https://www.xda-developers.com/google-revoke-huawei-android-ban-blacklist/)

My app was not capable to run on the brand new Huawei devices :(

So I tried to look for solutions to make this case study app running on the new Huawei terminals.

Let’s follow my journey…

#### The Discovery of HMS ML Kit

I went throughout the Huawei documentation on

[**HUAWEI Developer**  
\_The official site for HUAWEI developers. Provides HUAWEI appgallery service,HUAWEI Mobile Services,AI SDK,VR SDK and…\_developer.huawei.com](https://developer.huawei.com/consumer/en/ 'https://developer.huawei.com/consumer/en/')[](https://developer.huawei.com/consumer/en/)

here you can find many SDKs AKA Kits offering a set of smart features to the developers.

I’ve found one offering the features that I was looking for: HMS ML Kit. It is quite similar to the one from Firebase as it allows the developer to use Machine Learning capabilities like Image, Text, Face recognition and so on.

[**_ML Kit_**  
Huawei ML Kit](https://developer.huawei.com/consumer/en/hms/huawei-mlkit 'https://developer.huawei.com/consumer/en/hms/huawei-mlkit')[](https://developer.huawei.com/consumer/en/hms/huawei-mlkit)

In particular, for my specific use case, I’ve used the text analyzer capable to run locally and taking advantage of the neural processing using NPU hardware.

[**Documentation HMS ML Kit Text recognition**  
\_Introduction, Use cases, guide_developer.huawei.com](https://developer.huawei.com/consumer/en/doc/development/HMS-Guides/ml-text-intro-4 'https://developer.huawei.com/consumer/en/doc/development/HMS-Guides/ml-text-intro-4')[](https://developer.huawei.com/consumer/en/doc/development/HMS-Guides/ml-text-intro-4)

Integrating HMS ML Kit was super easy. If you want to give it a try It’s just a matter of adding a dependency in your _build.gradle_ file, enabling the service from the [AppGallery web dashboard](https://developer.huawei.com/consumer/en/service/josp/agc/index.html) if you want to use the Cloud API and download the _agconnect-services.json_ configuration file and use it in your app.

You can refer to the official guide here for the needed steps:

[**Documentation HMS ML Kit**  
\_Enabling the service_developer.huawei.com](https://developer.huawei.com/consumer/en/doc/development/HMS-Guides/ml-add-agc 'https://developer.huawei.com/consumer/en/doc/development/HMS-Guides/ml-add-agc')[](https://developer.huawei.com/consumer/en/doc/development/HMS-Guides/ml-add-agc)

#### Architectural Approach

My first desire was to maintain and deploy only one apk so I wanted to integrate both the Firebase ML Kit SDK and the HMS ML Kit one.

I thought about the main feature

_Decode the image and getting back the text detected together with the bounding boxes surrounding each character to better display the spotted text to the user._

This was defined by this interface

```kotlin
package com.laquysoft.wordsearchai.textrecognizer

import android.graphics.Bitmap

interface DocumentTextRecognizer {

    fun processImage(bitmap: Bitmap, success: (Document) -> Unit, error: (String?) -> Unit)
}
```

I’ve also defined my own data classes to have a common output format from both services

```kotlin
data class Symbol(
    val text: String?,
    val rect: Rect,
    val idx: Int = 0,
    val length: Int = 0
)

data class Document(val stringValue: String, val count: Int, val symbols: List<Symbol>)
```

Where Document represents the text result returned by the ML Kit services, it contains a list of Symbol (the character recognized) each one with its own char, the bounding box surrounding it (Rect), and the index in the string detected as both MLKit service will group some chars in a string with a unique bounding box.

Then I’ve created an object capable to instantiate the right service depending which service (HMS or GMS) is running on the device

```kotlin
object DocumentTextRecognizerService {

    private fun getServiceType(context: Context) = when {
        isGooglePlayServicesAvailable(
            context
        ) -> ServiceType.GOOGLE
        isHuaweiMobileServicesAvailable(
            context
        ) -> ServiceType.HUAWEI
        else -> ServiceType.GOOGLE
    }

    private fun isGooglePlayServicesAvailable(context: Context): Boolean {
        return GoogleApiAvailability.getInstance()
            .isGooglePlayServicesAvailable(context) == ConnectionResult.SUCCESS
    }

    private fun isHuaweiMobileServicesAvailable(context: Context): Boolean {
        return HuaweiApiAvailability.getInstance()
            .isHuaweiMobileServicesAvailable(context) == com.huawei.hms.api.ConnectionResult.SUCCESS

    }

    fun create(context: Context): DocumentTextRecognizer {
        val type =
            getServiceType(
                context
            )
        if (type == ServiceType.HUAWEI)
            return HMSDocumentTextRecognizer()
        return GMSDocumentTextRecognizer()
    }
}
```

This was pretty much all to make it works.

The ViewModel can use the service provided

```kotlin
class WordSearchAiViewModel(
    private val resourceProvider: ResourceProvider,
    private val recognizer: DocumentTextRecognizer
) : ViewModel() {

    val resultList: MutableLiveData<List<String>> = MutableLiveData()
    val resultBoundingBoxes: MutableLiveData<List<Symbol>> = MutableLiveData()

    private lateinit var dictionary: List<String>

    fun detectDocumentTextIn(bitmap: Bitmap) {

        loadDictionary()

        recognizer.processImage(bitmap, {
            postWordsFound(it)
            postBoundingBoxes(it)
        },
            {
                Log.e("WordSearchAIViewModel", it)
            })
    }
```

by the right recognizer instantiated when the WordSearchAiViewModel is instantiated as well.

Running the app and choosing a word search game image on a Mate 30 Pro (an HMS device) shows this result

![](https://cdn-images-1.medium.com/max/600/1*-b_SaLPqH0EGp3Fx9sMwYA.png)
undefined![](https://cdn-images-1.medium.com/max/600/1*o-ODB7v1MODEQ5FmGarS7w.png)

#### The Recognizer Brothers

You can check the code of the two recognizers below. What they are doing is to use the custom SDK implementation to get the result and adapt it to the interface, you can virtually use any other service capable to do the same.

```kotlin
package com.laquysoft.wordsearchai.textrecognizer

import android.graphics.Bitmap
import com.google.firebase.ml.vision.FirebaseVision
import com.google.firebase.ml.vision.common.FirebaseVisionImage

class GMSDocumentTextRecognizer : DocumentTextRecognizer {

    private val detector = FirebaseVision.getInstance().onDeviceTextRecognizer

    override fun processImage(
        bitmap: Bitmap,
        success: (Document) -> Unit,
        error: (String?) -> Unit
    ) {
        val firebaseImage = FirebaseVisionImage.fromBitmap(bitmap)
        detector.processImage(firebaseImage)
            .addOnSuccessListener { firebaseVisionDocumentText ->
                if (firebaseVisionDocumentText != null) {
                    val words = firebaseVisionDocumentText.textBlocks
                        .flatMap { it -> it.lines }
                        .flatMap { it.elements }

                    val symbols: MutableList<Symbol> = emptyList<Symbol>().toMutableList()

                    words.forEach {
                        val rect = it.boundingBox
                        if (rect != null) {
                            it.text.forEachIndexed { idx, value ->
                                symbols.add(
                                    Symbol(
                                        value.toString(),
                                        rect,
                                        idx,
                                        it.text.length
                                    )
                                )
                            }
                        }
                    }


                    val document =
                        Document(
                            firebaseVisionDocumentText.text,
                            firebaseVisionDocumentText.textBlocks.size,
                            symbols
                        )

                    success(document)
                }
            }
            .addOnFailureListener { error(it.localizedMessage) }
    }
}
```

```kotlin
package com.laquysoft.wordsearchai.textrecognizer

import android.graphics.Bitmap
import com.huawei.hms.mlsdk.MLAnalyzerFactory
import com.huawei.hms.mlsdk.common.MLFrame

class HMSDocumentTextRecognizer : DocumentTextRecognizer {

    //private val detector = MLAnalyzerFactory.getInstance().remoteDocumentAnalyzer
    private val detector = MLAnalyzerFactory.getInstance().localTextAnalyzer

    override fun processImage(
        bitmap: Bitmap,
        success: (Document) -> Unit,
        error: (String?) -> Unit
    ) {
        val hmsFrame = MLFrame.fromBitmap(bitmap)
        detector.asyncAnalyseFrame(hmsFrame)
            .addOnSuccessListener { mlDocument ->
                if (mlDocument != null) {
                    val words = mlDocument.blocks
                        .flatMap { it.contents }
                        .flatMap { it.contents }

                    val symbols: MutableList<Symbol> = emptyList<Symbol>().toMutableList()

                    words.forEach {
                        val rect = it.border
                        it.stringValue.forEachIndexed { idx, value ->
                            symbols.add(Symbol(
                                value.toString(),
                                rect,
                                idx,
                                it.stringValue.length
                            ))
                        }
                    }

                    val document =
                        Document(
                            mlDocument.stringValue,
                            mlDocument.blocks.size,
                            symbols
                        )

                    success(document)
                }
            }
            .addOnFailureListener { error(it.localizedMessage) }

    }
}
```

#### Conclusion

As good Android developers we should develop and deploy our apps in all the platforms our user can reach, love and adopt, without excluding anyone.

We should spend some time trying to give the users the same experience. This is a small sample about it and others will comes in the future.

If you are interested in the algorithm or the architecture of the app You can read all the source code of the complete app on

[**joaobiriba/WordSearchSolver**  
\_WordSearchSolver supporting Firebase ML Kit and Huawei HMS ML Kit This project is a sample using Firebase ML Kit and…\_github.com](https://github.com/joaobiriba/WordSearchSolver 'https://github.com/joaobiriba/WordSearchSolver')[](https://github.com/joaobiriba/WordSearchSolver)

This article is also published on

[**HUAWEI Developer Forum**  
forums.developer.huawei.com](https://forums.developer.huawei.com/forumPortal/en/topicview?tid=0201260592698140262&fid=0101187876626530001 'https://forums.developer.huawei.com/forumPortal/en/topicview?tid=0201260592698140262&fid=0101187876626530001')[](https://forums.developer.huawei.com/forumPortal/en/topicview?tid=0201260592698140262&fid=0101187876626530001)

You can ask your questions here and in the forum. Happy to answer :)
