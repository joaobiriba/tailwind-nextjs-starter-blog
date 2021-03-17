import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '@/components/social-icons'
import { PageSeo } from '@/components/SEO'

export default function About() {
  return (
    <>
      <PageSeo
        title={`About - ${siteMetadata.author}`}
        description={`About me - ${siteMetadata.author}`}
        url={`${siteMetadata.siteUrl}/about`}
      />
      <div className="divide-y">
        <div className="pt-6 pb-8 space-y-2 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="flex flex-col items-center pt-8 space-x-2">
            <img src={siteMetadata.image} alt="avatar" className="w-48 h-48 rounded-full" />
            <h3 className="pt-4 pb-2 text-2xl font-bold leading-8 tracking-tight">
              {siteMetadata.author}
            </h3>
            <div className="text-gray-500 dark:text-gray-400">Developer Advocate @ Huawei</div>
            <div className="text-gray-500 dark:text-gray-400">London, UK</div>
            <div className="flex pt-6 space-x-3">
              <SocialIcon kind="mail" href={`mailto:${siteMetadata.email}`} />
              <SocialIcon kind="github" href={siteMetadata.github} />
              <SocialIcon kind="linkedin" href={siteMetadata.linkedin} />
              <SocialIcon kind="twitter" href={siteMetadata.twitter} />
            </div>
          </div>
          <div className="pt-8 pb-8 prose dark:prose-dark max-w-none xl:col-span-2">
            <p>
              Started my development journey using Ada83 in the Archipelago of Real Time Systems
              years and years ago, migrated into Object Oriented country surviving to C, Python and
              Java. With these in the bag I've decided to leave for the newborn country of the
              Mobile Development choosing Android as a first town. I was not alone in the journey,
              many communities and events made me safe and satisfied and I liked to give back
              speaking about my past trips and helping the others during around the fire meetups
              (GDG, Facebook DevC, Mobile Tea and others) conferences like Droidcons and
              Codemotions. I'm ready to pack my bag for VR/AR worlds and AI new lands and currently
              helping Huawei ecosystem to be the safest and smartest harbour for developers!
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
