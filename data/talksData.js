const talksData = [
  {
    title: 'Programmiamo il Web Immersivo con WebXR',
    date: '04-Mar-2021',
    description: `Presente e futuro della tecnologia che ci permetterà di creare mondi virtuali supportati dal Browser.
     Impareremo cos’é la WebXR, uno standard supportato da molte aziende che definisce una piattaforma 
     unica dove sviluppare app di Realtà Virtuale e Realtà Aumentata.
    Grazie alla WebXR non avremo bisogno di distribuire la nostra XR app in uno store,
     preoccupandoci del device supportato. Basterà fare un deploy sul web come una comune Web App.
    Vedremo insieme dove questa tecnologia sta andando e quali sono i framework
     e i tool per cominciare ad utilizzarla. Basta conoscere un po di JS e si é pronti a sviluppare un
      mondo virtuale!`,
    imgSrc: '/static/images/webxr-4-3-2021.png',
    href: 'https://www.youtube.com/watch?v=YE5k4af--2E',
  },
  {
    title: 'Machine Learning Superpowers per la tua App',
    date: '25-Feb-2021',
    description: `Huawei ML Kit innovative features. First event of the community Huawei Developer Group
    Italia
    Stanco del solito classificatore di immagini? Vuoi rendere
     la tua app più intelligente?
     Non bisogna essere scienziati per donare alla tua App mobile i superpoteri del Machine Learning!
     Scopriamo insieme come rendere l'esperienza utente "quasi magica" utilizzando i servizi offerti 
     da HMS ML Kit.
     Analizzeremo casi pratici e tanto codice che ti aiuteranno a capire cosa puoi fare con questi servizi innovativi.`,
    imgSrc: '/static/images/hdgitalia25-2-2021.png',
    href: 'https://www.youtube.com/watch?v=gfvb8sBU9Hk',
  },
  {
    title: 'Huawei Mobile Services (HMS) Practical Flight Manual',
    date: '24-Feb-2021',
    description: `Talk for GDG Berlin -
    Do you know Your super cool Android App could not work anymore on the majority of Huawei Devices? Let's see together how can you adapt your codebase to make it works at best and make All your Users Happy again.

    We will check:
    · What HMS are
    · How they compare with other services
    · Source code and common techniques to use them in your App
    · How to test and deploy your final integrated App
    `,
    imgSrc: '/static/images/hms_flight_manual-24-02-2021.png',
    href: 'https://www.youtube.com/watch?v=kjhXMnL0iWs',
  },
  {
    title: 'Adapt your Android app for the HMS new world',
    date: '18-Oct-2020',
    description: `Talk for GDG Italy Dev Fest 2020 -
    After a political earthquake Huawei and Honor newest smartphone cannot run Google Mobile Services 
    and Google Play anymore. 
    Your cool app probably will not run fully in this new world.
     But all is not lost, it is still Android, and Huawei offers
      plenty of APIs to supply the lack of the GMS functionalities: 
      the Huawei Mobile Services (HMS). 
      You will learn how to make the appropriate lifting to your app to make it 
      compatible with the HMS and the AppGallery app-store, supports both stores and make your users happy.`,
    imgSrc: '/static/images/gdg-dev-fest-18-10-2020.png',
    href: 'https://www.youtube.com/watch?v=VrwEalpRc1c',
  },
  {
    title:
      'AI Boost HMS Traffic: AI kits help developers easily build apps - make apps more intelligent',
    date: '10-Sep-2020',
    description: `Talk for Huawei Developer Conference 2020 -
    How can AI services boost your traffic? In this session, we'll look at how developers can use HUAWEI Assistant·TODAY to provide intelligent services to users. HUAWEI Ability Gallery brings new touch points, devices, and capabilities to improve integration and traffic distribution efficiency. 
    We'll also look at how Huawei AI kits can help global developers easily build apps.
    `,
    imgSrc: '/static/images/hms_ai_kits.png',
    href: 'https://www.youtube.com/watch?v=S7-pXD67OCo',
  },
  {
    title: 'AI Boost HMS Traffic: Embrace Digital Person in the real world',
    date: '10-Sep-2020',
    description: `Talk for Huawei Developer Conference 2020 -
    This session is about the super cool service from Huawei AI that allow users to create
    their own Virtual Person to present their customized content`,
    imgSrc: '/static/images/virtualhuman.png',
    href: 'https://www.youtube.com/watch?v=OuEx83Mlqrk',
  },
  {
    title:
      'AI Boost HMS Traffic: MindSpore Lite - ultra-high performance, intelligence, and simplicity',
    date: '10-Sep-2020',
    description: `Talk for Huawei Developer Conference 2020 -
    This session is about Mindspore and Mindspore Lite. These are the innovative AI Computing Frameworks, optimized for distribute learning,
    smart devices and IoT devices.
    `,
    href: 'https://www.youtube.com/watch?v=dMe86s_uvhY',
  },
  {
    title: 'A Real use case of practical AR-AI couple: Size my luggage ',
    date: '25-Oct-2019',
    description: `Droidcon London 2019 -
    This session is an use case of Augmented Reality and AI used in the travel sector. Let's discover together how
    to identify a luggage and size it to check if its size is allowed for your travel.
    `,
    href: 'https://www.droidcon.com/media-detail?video=390725539',
  },
  {
    title: 'A Real use case of practical AR-AI couple: Size my luggage ',
    date: '19-Sep-2019',
    description: `Droidcon Vienna 2019 Keynote -
    We are reading about AR as the future platform even though we are currently experiencing
     only gaming/entertainment use cases about it. Let's look an effective non-gaming sample: 
     Many travel and transport companies are using AR to help you to understand if your luggage 
     fit their limits. We will analyze their apps and learn how to develop 
     an Android native app doing the same using ARCore, Sceneform and a bit of AI with Firebase ML Kit.
      At the end you will be able to apply this new skills to new exciting use cases.`,
    href: 'https://www.facebook.com/droidconvie/videos/400857253929654/',
  },
  {
    title: 'A Real use case of practical AR-AI couple: Size my luggage ',
    date: '01-Jul-2019',
    description: `Droidcon Berlin 2019 -
    We are reading about AR as the future platform even though we are currently experiencing
     only gaming/entertainment use cases about it. Let's look an effective non-gaming sample: 
     Many travel and transport companies are using AR to help you to understand if your luggage 
     fit their limits. We will analyze their apps and learn how to develop 
     an Android native app doing the same using ARCore, Sceneform and a bit of AI with Firebase ML Kit.
      At the end you will be able to apply this new skills to new exciting use cases.`,
    href: 'https://www.droidcon.com/media-detail?video=353345607',
  },
  {
    title: 'Kotlin DSL magic for Augmented Reality',
    date: '01-Dec-2018',
    description: `GDG Dev Fest 2018 -
    With ARCore and Sceneform we can easily create super cool augmented reality
     applications without passing through the OpenGL dark arts...but we can do more. 
     Just with Kotlin DSL magic we can develop a clean and expressive way to add virtual elements
      to the reality canvas. In this talk you will learn how to create a Kotlin DSL to build Android AR apps
       fueled by ARCore and Sceneform.
    `,
    href: 'https://youtu.be/brufiTSQ1rA?t=23129',
  },
  {
    title: 'Hello ARCore',
    date: '11-Dec-2017',
    description: `Codemotion Milan 2017 -
    Get ready to develop a brand new experiences that seamlessly blend the digital and physical worlds 
    with Android! We will learn the potential of the new AR SDK from Google, ARCore.
     By looking its 3 key technologies: Motion tracking, Environmental understanding and Light
      estimation We will have a clear vision of what We can develop with. 
      You will be back at home with a deeper understanding of how to create AR apps with ARCore
       using your development environment and ready-to-reuse code samples.`,
    href: 'https://www.youtube.com/watch?v=Kfril2-E4Ug',
  },
  {
    title: 'Webinar: Creare applicazioni VR',
    date: '29-Sep-2017',
    description: `Codemotion -
    Come creare soluzioni VR che girino sullo smartphone? In questo Webinar andremo ad introdurre i fondamenti per creare una applicazione VR per mobile. Ci soffermeremo su Unity e i principali framework per far funzionare le applicazioni su Cardboard, Daydream and Gear VR. 
    Infine daremo un sguardo alle differenze tra le piattaforme di applicazioni VR.`,
    href: 'https://www.youtube.com/watch?v=ng4-Ib0t8EA',
  },
  {
    title: 'Small bricks of virtual reality web',
    date: '15-Dec-2016',
    description: `Codemotion Milan 2016 -
    Let's prototype VR experiences running in your browser! 
    We don't need any complex tools but a bag full of VR bricks designed by Mozilla (aframe.io)
     and our knowledge of html5 and js.`,
    href: 'https://www.youtube.com/watch?v=fjbm77zX89c',
  },
  {
    title: 'Having fun with droidcon NFC/QR hunt',
    date: '08-Jun-2015',
    description: `Droicon Berlin 2015 -
    Did you play with our funny game in Droidcon?
    Now it's time to understand how we develop it starting by the open source code by Google,
    extended it with new design, improved functionality and enhanced experience.`,
    href: 'https://www.youtube.com/watch?v=I3-_LhLTt5c',
  },
  {
    title: 'Join The Dart Side Of Web Development 2',
    date: '03-Apr-2015',
    description: `Droicon Berlin 2015 -
    Hai seguito il precedente Talk su Dart a Codemotion Roma e Milano 2014? 
    Ti ha incuriosito questo nuovo e potente linguaggio "battery included" by Google?
     Allora proseguiamo questo viaggio all'interno del Dartiverse, visiteremo insieme Polymer.Dart,
      Dart Force, e StageXL alcune tra la più potenti librerie per realizzare Web App davvero potenti
       in maniera semplice.`,
    href: 'https://www.youtube.com/watch?v=qXVUr9byvko',
  },
]

export default talksData
