import { Permission } from "@/app/lib/enum"

const headerNavLinks = [
    { href: '/', title: 'Home',permission: '' },
    { href: '/routes', title: 'Routes' , permission:''},
    { href: '/points', title: 'Points' , permission:''},
    { href: '/accounts', title: 'User Account', permission: Permission.READ_ACCOUNT},
    { href: '/roles', title: 'Role', permission: Permission.READ_ROLE },
    // { href: '/about', title: 'About' },
  ]
  
  export default headerNavLinks