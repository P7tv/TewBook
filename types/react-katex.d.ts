declare module 'react-katex' {
  import { ReactNode } from 'react'

  export interface InlineMathProps {
    math: string
    children?: ReactNode
    className?: string
    style?: React.CSSProperties
  }

  export interface BlockMathProps {
    math: string
    children?: ReactNode
    className?: string
    style?: React.CSSProperties
  }

  export function InlineMath(props: InlineMathProps): JSX.Element
  export function BlockMath(props: BlockMathProps): JSX.Element
} 