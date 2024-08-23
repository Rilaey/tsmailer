import { useState } from 'react'
import { Group, Code, Button } from '@mantine/core'
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
} from '@tabler/icons-react'
import classes from './Navbar.module.css'
import { signOut } from 'next-auth/react'

const data = [
  { link: '/services', label: 'Services', icon: IconBellRinging },
  { link: '/templates', label: 'Templates', icon: IconReceipt2 },
  { link: '/email-history', label: 'Email History', icon: IconFingerprint },
  { link: '/contact', label: 'Contacts', icon: IconKey },
  { link: '/statistics', label: 'Statistics', icon: Icon2fa },
  { link: '/settings', label: 'Settings', icon: IconSettings },
]

export function Navbar() {
  const [active, setActive] = useState('Services')

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.label === active || undefined}
      href={item.link}
      key={item.label}
      onClick={(event) => {
        event.preventDefault()
        setActive(item.label)
      }}
    >
      <item.icon className={classes.linkIcon} stroke={1.5} />
      <span>{item.label}</span>
    </a>
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
          <IconLogout className={classes.linkIcon} stroke={1.5} />

          <Button c="#fefefe" onClick={() => signOut()}>
            Logout
          </Button>
        </a>
      </div>
    </nav>
  )
}

export default Navbar
