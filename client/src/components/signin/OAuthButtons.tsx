import { Button } from "@/components/ui/button";

export const OAuthButtons = () => {
  return (
    <>
      <Button
        variant="outline"
        type="button"
        onClick={() =>
          (window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`)
        }
      >
        <svg width="256px" height="256px" viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </g></svg>
        Continue with Google
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() =>
          (window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`)
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
            fill="currentColor"
          />
        </svg>
        Continue with GitHub
      </Button>

      <Button
        variant="outline"
        type="button"
        onClick={() =>
          (window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`)
        }
      >
        <svg width="256px" height="256px" viewBox="0 0 16.00 16.00" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.192"></g><g id="SVGRepo_iconCarrier"><path fill="#F35325" d="M1 1h6.5v6.5H1V1z"></path><path fill="#81BC06" d="M8.5 1H15v6.5H8.5V1z"></path><path fill="#05A6F0" d="M1 8.5h6.5V15H1V8.5z"></path><path fill="#FFBA08" d="M8.5 8.5H15V15H8.5V8.5z"></path></g></svg>        Continue with Microsoft
      </Button>

      <div className="flex gap-4 w-full">
        <Button variant="outline" className="flex-1" type="button" onClick={() => (window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`)}>
          <svg width="256px" height="256px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#FC6D26" d="M14.975 8.904L14.19 6.55l-1.552-4.67a.268.268 0 00-.255-.18.268.268 0 00-.254.18l-1.552 4.667H5.422L3.87 1.879a.267.267 0 00-.254-.179.267.267 0 00-.254.18l-1.55 4.667-.784 2.357a.515.515 0 00.193.583l6.78 4.812 6.778-4.812a.516.516 0 00.196-.583z"></path><path fill="#E24329" d="M8 14.296l2.578-7.75H5.423L8 14.296z"></path><path fill="#FC6D26" d="M8 14.296l-2.579-7.75H1.813L8 14.296z"></path><path fill="#FCA326" d="M1.81 6.549l-.784 2.354a.515.515 0 00.193.583L8 14.3 1.81 6.55z"></path><path fill="#E24329" d="M1.812 6.549h3.612L3.87 1.882a.268.268 0 00-.254-.18.268.268 0 00-.255.18L1.812 6.549z"></path><path fill="#FC6D26" d="M8 14.296l2.578-7.75h3.614L8 14.296z"></path><path fill="#FCA326" d="M14.19 6.549l.783 2.354a.514.514 0 01-.193.583L8 14.296l6.188-7.747h.001z"></path><path fill="#E24329" d="M14.19 6.549H10.58l1.551-4.667a.267.267 0 01.255-.18c.115 0 .217.073.254.18l1.552 4.667z"></path></g></svg>
          GitLab
        </Button>

        <Button variant="outline" className="flex-1" type="button" onClick={() => (window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`)}>
          <svg viewBox="0 -12.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <linearGradient x1="108.63338%" y1="13.818022%" x2="46.9265964%" y2="78.7761408%" id="linearGradient-1"> <stop stop-color="#0052CC" offset="18%"> </stop> <stop stop-color="#2684FF" offset="100%"> </stop> </linearGradient> </defs> <g fill="none"> <polygon points="101.272088 152.561281 154.720712 152.561281 167.622105 77.2417255 87.0600784 77.2417255"> </polygon> <path d="M8.30813067,0.000683498206 C5.88502974,-0.0305685468 3.57212663,1.01125669 1.98985644,2.84669011 C0.407586248,4.68212353 -0.282086001,7.12328571 0.105843921,9.51533612 L34.9245512,220.888266 C35.8200362,226.227525 40.4199456,230.153012 45.8335925,230.197861 L212.873162,230.197861 C216.936516,230.250159 220.425595,227.319332 221.075449,223.30794 L255.894156,9.55634756 C256.282086,7.16429714 255.592414,4.72313497 254.010144,2.88770154 C252.427873,1.05226812 250.11497,0.0104428869 247.691869,0.0416949319 L8.30813067,0.000683498206 Z M154.924006,152.768274 L101.609142,152.768274 L87.1731177,77.3482475 L167.842608,77.3482475 L154.924006,152.768274 Z" fill="#2684FF"> </path> <path d="M244.610824,77.2417255 L167.693776,77.2417255 L154.78548,152.601582 L101.513151,152.601582 L38.6108235,227.264801 C40.6045494,228.988786 43.1464609,229.94745 45.7820986,229.969396 L212.729383,229.969396 C216.789495,230.021652 220.275791,227.093164 220.925126,223.084972 L244.610824,77.2417255 Z" fill="url(#linearGradient-1)"> </path> </g> </g></svg>
          BitBucket
        </Button>
      </div>
    </>
  );
}
