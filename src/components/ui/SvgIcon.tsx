import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SvgIconSize = number | 'sm' | 'md' | 'lg';

const sizeMap: Record<Exclude<SvgIconSize, number>, number> = {
  sm: 16,
  md: 24,
  lg: 32,
};

type SvgIconProps = {
  name: string;
  size?: SvgIconSize;
  className?: string;
  title?: string;
  desc?: string;
  decorative?: boolean;
  'aria-label'?: string;
};

export const SvgIcon: React.FC<SvgIconProps> = ({
  name,
  size = 'md',
  className,
  title,
  desc,
  decorative = false,
  'aria-label': ariaLabel,
}) => {
  const px = typeof size === 'number' ? size : sizeMap[size];
  const id = React.useId();
  const titleId = title ? `${id}-title` : undefined;
  const descId = desc ? `${id}-desc` : undefined;
  const labelledBy = [titleId, descId].filter(Boolean).join(' ') || undefined;

  const ariaProps = decorative
    ? ({ 'aria-hidden': true } as const)
    : ({
        role: 'img',
        'aria-label': ariaLabel ?? title ?? name,
        'aria-labelledby': labelledBy,
      } as const);

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      className={cn('inline-block align-middle text-current', className)}
      focusable="false"
      {...ariaProps}
    >
      {title ? <title id={titleId}>{title}</title> : null}
      {desc ? <desc id={descId}>{desc}</desc> : null}
      <use href={`#icon-${name}`} />
    </svg>
  );
};

