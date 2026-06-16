import React, { FC } from 'react'
import { SocialLink } from '@/interfaces/social-link'

export const socialLinks: SocialLink[] = [
  { name: 'Instagram', link: '#', icon: '/images/icons/instagram.svg' },
  { name: 'YouTube', link: '#', icon: '/images/icons/youtube.svg' },
  { name: 'Twitter', link: '#', icon: '/images/icons/twitter.svg' },
  { name: 'Github', link: '#', icon: '/images/icons/github.svg' },
]

interface SocialLinkItemProps {
  item: SocialLink
}

const SocialLinkItem: FC<SocialLinkItemProps> = ({ item }) => (
  <li className="inline-block mr-1">
    <a
      target="_blank"
      rel="noreferrer"
      href={item.link}
      className="flex items-center justify-center w-9 h-9 rounded-full text-white hover:bg-[#082F49] transition-colors"
    >
      {/* eslint-disable-next-line */}
      <img src={item.icon} alt={item.name + ' icon'} className="w-[22px] h-auto" />
    </a>
  </li>
)

const SocialLinks: FC = () => {
  return (
    <ul className="flex flex-wrap list-none m-0 p-0 -ml-1">
      {socialLinks.map((item) => (
        <SocialLinkItem key={item.name} item={item} />
      ))}
    </ul>
  )
}

export default SocialLinks
