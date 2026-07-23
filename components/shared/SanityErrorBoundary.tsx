'use client'

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export default class SanityErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="py-12 px-6 text-center">
          <p className="text-black/60 text-sm">Content is loading. Please refresh the page.</p>
        </div>
      )
    }
    return this.props.children
  }
}
