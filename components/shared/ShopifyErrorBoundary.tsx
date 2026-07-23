'use client'

import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean }

export default class ShopifyErrorBoundary extends Component<Props, State> {
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
          <p className="text-black/60 text-sm">
            Our shop is temporarily unavailable. Please try again shortly or{' '}
            <a href="/contact" className="underline text-[#E79489]">contact us directly</a>.
          </p>
        </div>
      )
    }
    return this.props.children
  }
}
