import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ReactIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="12" cy="12" rx="10" ry="4.2" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
      </g>
    </svg>
  );
}

export function NextIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="10.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9.2 8.4v7.2M9.2 8.4 15.6 16.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M15.1 8.4v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function TypeScriptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 12h4.6M10.3 12v5.4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14.4 16.6c.4.5 1 .8 1.8.8 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-1.7-1.5-1.1-.4-2-.8-2-2 0-1.1 1-1.8 2.1-1.8.8 0 1.4.3 1.8.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function JavaScriptIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3.5" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9.6 8.6v6.1c0 1.4-.6 2-1.7 2-.7 0-1.2-.3-1.6-.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13.4 16.6c.4.5 1 .8 1.8.8 1.1 0 1.8-.5 1.8-1.3 0-.9-.7-1.2-1.7-1.5-1.1-.4-2-.8-2-2 0-1.1 1-1.8 2.1-1.8.8 0 1.4.3 1.8.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HtmlIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 3h16l-1.4 16L12 21l-6.6-2L4 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M7.2 6.4h9.4l-.3 3.4H9.6l.2 2.2h6.3l-.5 5.2-3.6 1.1-3.6-1.1-.2-2.2"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CssIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M4 3h16l-1.4 16L12 21l-6.6-2L4 3Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path
        d="M16.6 6.4H7.2l.3 3.2h8.4l-.3 3.4-4 1.1-4-1.1-.1-1.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ApiIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M8.5 9 5 12l3.5 3M15.5 9 19 12l-3.5 3M13.2 7l-2.4 10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TailwindIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M6 12.3c.6-2.4 2-3.6 4.2-3.6 2.2 0 3.2 1.7 4.6 1.7 1 0 1.8-.5 2.2-1.7-.6 2.4-2 3.6-4.2 3.6-2.2 0-3.2-1.7-4.6-1.7-1 0-1.8.5-2.2 1.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path
        d="M2 16.9c.6-2.4 2-3.6 4.2-3.6 2.2 0 3.2 1.7 4.6 1.7 1 0 1.8-.5 2.2-1.7-.6 2.4-2 3.6-4.2 3.6-2.2 0-3.2-1.7-4.6-1.7-1 0-1.8.5-2.2 1.7Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
