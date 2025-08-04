"use client"

import 'katex/dist/katex.min.css'
import { InlineMath, BlockMath } from 'react-katex'

interface MathFormulaProps {
  formula: string
  display?: 'inline' | 'block'
  className?: string
  subject?: 'physics' | 'chemistry' | 'biology' | 'math'
}

export function MathFormula({ formula, display = 'inline', className = '', subject }: MathFormulaProps) {
  const getSubjectClass = () => {
    switch (subject) {
      case 'physics':
        return 'physics-formula'
      case 'chemistry':
        return 'chemistry-formula'
      case 'biology':
        return 'biology-formula'
      default:
        return 'formula-container'
    }
  }

  if (display === 'block') {
    return (
      <div className={`my-4 ${className} ${getSubjectClass()}`}>
        <BlockMath math={formula} />
      </div>
    )
  }

  return (
    <span className={`inline ${className}`}>
      <InlineMath math={formula} />
    </span>
  )
}

// Helper function to detect and format math formulas in text
export function formatMathText(text: string, subject?: 'physics' | 'chemistry' | 'biology' | 'math'): React.ReactNode[] {
  // Split text by math delimiters
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/)
  
  return parts.map((part, index) => {
    if (part.startsWith('$$') && part.endsWith('$$')) {
      // Block math
      const formula = part.slice(2, -2)
      return (
        <MathFormula 
          key={index} 
          formula={formula} 
          display="block" 
          className="my-4 text-center"
          subject={subject}
        />
      )
    } else if (part.startsWith('$') && part.endsWith('$')) {
      // Inline math
      const formula = part.slice(1, -1)
      return (
        <MathFormula 
          key={index} 
          formula={formula} 
          display="inline" 
          className="mx-1"
          subject={subject}
        />
      )
    } else {
      // Regular text
      return <span key={index}>{part}</span>
    }
  })
}

// Common physics formulas with LaTeX formatting
export const PHYSICS_FORMULAS = {
  // Kinematics
  averageAcceleration: 'a_{avg} = \\frac{v_f - v_i}{t}',
  instantaneousAcceleration: 'a = \\lim_{\\Delta t \\to 0} \\frac{\\Delta v}{\\Delta t} = \\frac{dv}{dt}',
  velocityFinal: 'v_f = v_i + at',
  displacement: '\\Delta x = v_i t + \\frac{1}{2}at^2',
  velocitySquared: 'v_f^2 = v_i^2 + 2a\\Delta x',
  
  // Forces
  newtonSecond: 'F = ma',
  weight: 'W = mg',
  friction: 'f = \\mu N',
  
  // Energy
  kineticEnergy: 'K = \\frac{1}{2}mv^2',
  potentialEnergy: 'U = mgh',
  totalEnergy: 'E = K + U',
  
  // Waves
  waveSpeed: 'v = f\\lambda',
  frequency: 'f = \\frac{1}{T}',
  
  // Electricity
  ohmLaw: 'V = IR',
  power: 'P = VI',
  resistance: 'R = \\frac{V}{I}',
  
  // Thermodynamics
  idealGasLaw: 'PV = nRT',
  heatCapacity: 'Q = mc\\Delta T',
  
  // Optics
  snellLaw: 'n_1\\sin\\theta_1 = n_2\\sin\\theta_2',
  lensEquation: '\\frac{1}{f} = \\frac{1}{d_o} + \\frac{1}{d_i}',
  
  // Modern Physics
  einsteinEnergy: 'E = mc^2',
  planckEnergy: 'E = hf',
  deBroglie: '\\lambda = \\frac{h}{p}'
}

// Helper function to convert plain text formulas to LaTeX
export function convertToLatex(formula: string): string {
  const conversions: Record<string, string> = {
    // Basic math symbols
    'avg a = (vf - vi) / t': PHYSICS_FORMULAS.averageAcceleration,
    'a = lim (At→0) (Av / ∆t)': PHYSICS_FORMULAS.instantaneousAcceleration,
    'vf = vi + at': PHYSICS_FORMULAS.velocityFinal,
    '∆x = vit + (1/2)at²': PHYSICS_FORMULAS.displacement,
    'vx² = vi² + 2a∆x': PHYSICS_FORMULAS.velocitySquared,
    
    // Common variables
    'vf': 'v_f',
    'vi': 'v_i',
    'at': 'at',
    '∆x': '\\Delta x',
    '∆t': '\\Delta t',
    '∆v': '\\Delta v',
    
    // Fractions
    '1/2': '\\frac{1}{2}',
    '1/3': '\\frac{1}{3}',
    '1/4': '\\frac{1}{4}',
    
    // Greek letters
    '∆': '\\Delta',
    'θ': '\\theta',
    'α': '\\alpha',
    'β': '\\beta',
    'γ': '\\gamma',
    'δ': '\\delta',
    'ε': '\\epsilon',
    'μ': '\\mu',
    'π': '\\pi',
    'σ': '\\sigma',
    'τ': '\\tau',
    'φ': '\\phi',
    'ω': '\\omega',
    
    // Subscripts and superscripts
    't²': 't^2',
    'v²': 'v^2',
    'x²': 'x^2',
    'a²': 'a^2',
    'b²': 'b^2',
    'c²': 'c^2',
    
    // Common physics terms
    'lim': '\\lim',
    'sin': '\\sin',
    'cos': '\\cos',
    'tan': '\\tan',
    'log': '\\log',
    'ln': '\\ln',
    'exp': '\\exp',
    
    // Arrows
    '→': '\\to',
    '←': '\\leftarrow',
    '↔': '\\leftrightarrow',
    '⇒': '\\Rightarrow',
    '⇐': '\\Leftarrow',
    '⇔': '\\Leftrightarrow'
  }
  
  let latexFormula = formula
  
  // Apply conversions
  for (const [plain, latex] of Object.entries(conversions)) {
    latexFormula = latexFormula.replace(new RegExp(plain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), latex)
  }
  
  return latexFormula
} 