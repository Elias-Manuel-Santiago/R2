import type { ReactNode } from 'react'
import './PageHeading.css'

type PageHeadingProps = {
  eyebrow: string
  title: string
  description?: string
  actions?: ReactNode
}

function PageHeading({ eyebrow, title, description, actions }: PageHeadingProps) {
  return (
    <div className="page-heading">
      <div className="page-heading__copy">
        <span className="page-heading__eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {actions && <div className="page-heading__actions">{actions}</div>}
    </div>
  )
}

export default PageHeading
