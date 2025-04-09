import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";

import { ThemeSwitch } from "@/components/theme-switch";

export const Navbar = () => {
  return (
    <HeroUINavbar maxWidth="xl" position="sticky">
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand className="gap-3 max-w-fit">
          <div className="flex justify-start items-center gap-1">
            <img alt="Logo" className="w-10 h-10 mr-2" src="/logo.png" />
            <p className="font-bold text-inherit">ACME</p>
          </div>
        </NavbarBrand>
        {/*<div className="hidden lg:flex gap-4 justify-start ml-2">*/}
        {/*  {siteConfig.navItems.map((item) => (*/}
        {/*    <NavbarItem key={item.href}>*/}
        {/*      <Link*/}
        {/*        className={clsx(*/}
        {/*          linkStyles({ color: "foreground" }),*/}
        {/*          "data-[active=true]:text-primary data-[active=true]:font-medium",*/}
        {/*        )}*/}
        {/*        color="foreground"*/}
        {/*        href={item.href}*/}
        {/*      >*/}
        {/*        {item.label}*/}
        {/*      </Link>*/}
        {/*    </NavbarItem>*/}
        {/*  ))}*/}
        {/*</div>*/}
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          {/*<Link isExternal href={siteConfig.links.twitter} title="Twitter">*/}
          {/*  <TwitterIcon className="text-default-500" />*/}
          {/*</Link>*/}
          {/*<Link isExternal href={siteConfig.links.discord} title="Discord">*/}
          {/*  <DiscordIcon className="text-default-500" />*/}
          {/*</Link>*/}
          {/*<Link isExternal href={siteConfig.links.github} title="GitHub">*/}
          {/*  <GithubIcon className="text-default-500" />*/}
          {/*</Link>*/}
          <ThemeSwitch />
        </NavbarItem>
        {/*<NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem>*/}
        {/*<NavbarItem className="hidden md:flex">*/}
        {/*  <Button*/}
        {/*    isExternal*/}
        {/*    as={Link}*/}
        {/*    className="text-sm font-normal text-default-600 bg-default-100"*/}
        {/*    href={siteConfig.links.sponsor}*/}
        {/*    startContent={<HeartFilledIcon className="text-danger" />}*/}
        {/*    variant="flat"*/}
        {/*  >*/}
        {/*    Sponsor*/}
        {/*  </Button>*/}
        {/*</NavbarItem>*/}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end" />
    </HeroUINavbar>
  );
};
