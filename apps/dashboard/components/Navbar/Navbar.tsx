import { useState, useEffect } from 'react'
import { Button } from '@mantine/core'
import {
  IconKey,
  IconSettings,
  IconSwitchHorizontal,
  IconDashboard,
  IconMail,
  IconTextDirectionLtr,
  IconHistory,
} from '@tabler/icons-react'
import classes from './Navbar.module.css'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

const data = [
  { link: '/', label: 'Dashboard', icon: IconDashboard },
  { link: '/providers', label: 'Providers', icon: IconMail },
  { link: '/templates', label: 'Templates', icon: IconTextDirectionLtr },
  { link: '/email-history', label: 'Email History', icon: IconHistory },
  { link: '/contacts', label: 'Contacts', icon: IconKey },
  { link: '/settings', label: 'Settings', icon: IconSettings },
]

export function Navbar() {
  const router = useRouter()
  const [active, setActive] = useState('')

  // Set the active link based on the current route
  useEffect(() => {
    const currentPath = router.asPath
    const currentItem = data.find((item) => item.link === currentPath)
    setActive(currentItem?.label || 'Dashboard')
  }, [router.asPath])

  const links = data.map((item) => (
    <Link
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={() => setActive(item.label)}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </Link>
  ))

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>{links}</div>

      <div className={classes.footer}>
        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Manage account</span>
        </a>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <Button fullWidth c="#fefefe" onClick={() => signOut()}>
            Logout
          </Button>
        </a>
      </div>
    </nav>
  )
}

export default Navbar
