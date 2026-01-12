import { type VariantProps, cva } from 'class-variance-authority';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

const buttonVariants = cva(
  'flex-row items-center justify-center rounded-lg active:opacity-80',
  {
    variants: {
      variant: {
        default: 'bg-primary',
        destructive: 'bg-destructive',
        outline: 'border border-input bg-background',
        secondary: 'bg-secondary',
        ghost: 'bg-transparent',
        link: 'bg-transparent',
      },
      size: {
        default: 'h-12 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-14 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const textVariants = cva('text-base font-medium', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-primary-foreground',
      outline: 'text-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'text-foreground',
      link: 'text-primary underline underline-offset-4',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ButtonProps
  extends React.ComponentPropsWithoutRef<typeof Pressable>,
    VariantProps<typeof buttonVariants> {
  label?: string;
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  label,
  children,
  loading,
  disabled,
  accessibilityLabel,
  ...props
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const palette = Colors[colorScheme];

  const loaderColor =
    variant === 'outline' || variant === 'ghost'
      ? palette.foreground
      : variant === 'secondary'
        ? palette.secondaryForeground
        : palette.primaryForeground;

  return (
    <Pressable
      className={cn(
        buttonVariants({ variant, size, className }),
        (disabled || loading) && 'opacity-50'
      )}
      disabled={disabled || loading}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <>
          {label ? (
            <Text className={cn(textVariants({ variant }))}>{label}</Text>
          ) : (
            children
          )}
        </>
      )}
    </Pressable>
  );
}
