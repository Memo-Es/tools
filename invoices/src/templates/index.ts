import type { ComponentType } from 'react'
import type { TemplateId, TemplateProps } from '../lib/types'
import { Editorial } from './Editorial'
import { Grotesk } from './Grotesk'
import { Mono } from './Mono'

export const templates: { id: TemplateId; label: string; component: ComponentType<TemplateProps> }[] = [
  { id: 'editorial', label: 'Editorial', component: Editorial },
  { id: 'mono', label: 'Mono', component: Mono },
  { id: 'grotesk', label: 'Grotesk', component: Grotesk },
]
