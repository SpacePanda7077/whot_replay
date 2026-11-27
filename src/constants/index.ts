import { ENDPOINT } from "../api/glogal-api";

//import { people01, people02, people03, facebook, instagram, linkedin, twitter, airbnb, binance, coinbase, dropbox, send, shield, star  } from "../assets";
export const CONFIG = {
    local: {
        BACKEND_URL: `https://whotafrica.com/api`,
    },
    dev: {
        // Prefer same-origin so the site always talks to the server it was deployed with.
        BACKEND_URL:
            typeof window !== "undefined"
                ? `${window.location.origin}/api`
                : "https://simplywhot.com/api",
    },
    live: {
        BACKEND_URL:
            typeof window !== "undefined"
                ? `${window.location.origin}/api`
                : "https://whotafrica.com/api",
    },
} as const;

export type RunMode = keyof typeof CONFIG;

function inferRunModeFromHostname(hostname: string): RunMode {
    const h = (hostname || "").toLowerCase();
    if (h === "whotafrica.com" || h.endsWith(".whotafrica.com")) return "live";
    if (h === "simplywhot.com" || h.endsWith(".simplywhot.com")) return "dev";
    return "local";
}

const inferredRunMode =
    typeof window !== "undefined"
        ? inferRunModeFromHostname(window.location.hostname)
        : ("local" as RunMode);

export const RUN_MODE: RunMode = inferredRunMode;

export const CURRENCY_NGN = 0;
export const CURRENCY_KSH = 1;
export const CRYPTO_TRC20_USDT = 10;
export const CRYPTO_ERC20_USDT = 11;

export const USDTERC20_CODE = "USDTERC20";
export const USDTTRC20_CODE = "USDTTRC20";
export const NGN_CODE = "NGN";
export const KSH_CODE = "KSH";

export const navLinks = [
    {
        id: "home",
        title: "Home",
    },
    {
        id: "services",
        title: "Services",
    },
    {
        id: "about",
        title: "About",
    },
    {
        id: "basic_info",
        title: "Basic Info",
    },
];

export const stats = [
    {
        id: "stats-1",
        title: "User Active",
        value: "3800+",
    },
    {
        id: "stats-2",
        title: "Trusted by Company",
        value: "230+",
    },
    {
        id: "stats-3",
        title: "Transaction",
        value: "$230M+",
    },
];

export const footerLinks = [
    {
        title: "Useful Links",
        links: [
            {
                name: "Content",
                link: "https://www.hoobank.com/content/",
            },
            {
                name: "How it Works",
                link: "https://www.hoobank.com/how-it-works/",
            },
            {
                name: "Create",
                link: "https://www.hoobank.com/create/",
            },
            {
                name: "Explore",
                link: "https://www.hoobank.com/explore/",
            },
            {
                name: "Terms & Services",
                link: "https://www.hoobank.com/terms-and-services/",
            },
        ],
    },
    {
        title: "Community",
        links: [
            {
                name: "Help Center",
                link: "https://www.hoobank.com/help-center/",
            },
            {
                name: "Partners",
                link: "https://www.hoobank.com/partners/",
            },
            {
                name: "Suggestions",
                link: "https://www.hoobank.com/suggestions/",
            },
            {
                name: "Blog",
                link: "https://www.hoobank.com/blog/",
            },
            {
                name: "Newsletters",
                link: "https://www.hoobank.com/newsletters/",
            },
        ],
    },
    {
        title: "Partner",
        links: [
            {
                name: "Our Partner",
                link: "https://www.hoobank.com/our-partner/",
            },
            {
                name: "Become a Partner",
                link: "https://www.hoobank.com/become-a-partner/",
            },
        ],
    },
];

export const socialMedia = [
    {
        id: "social-media-1",
        // icon: instagram,
        link: "https://www.instagram.com/",
    },
    {
        id: "social-media-2",
        // icon: facebook,
        link: "https://www.facebook.com/",
    },
    {
        id: "social-media-3",
        // icon: twitter,
        link: "https://www.twitter.com/",
    },
    {
        id: "social-media-4",
        // icon: linkedin,
        link: "https://www.linkedin.com/",
    },
];

export const clients = [
    {
        id: "client-1",
        // logo: airbnb,
    },
    {
        id: "client-2",
        // logo: binance,
    },
    {
        id: "client-3",
        // logo: coinbase,
    },
    {
        id: "client-4",
        // logo: dropbox,
    },
];

export const keyfeatures = [
    {
        id: "friendly",
        title: "USER FRIENDLY",
    },
    {
        id: "interface",
        title: "SEAMLESS INTERFACE",
    },
    {
        id: "navigation",
        title: "SLEEK NAVIGATION",
    },
    {
        id: "prize",
        title: "CASH PRIZES",
    },
];

