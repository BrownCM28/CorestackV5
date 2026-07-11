import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import PayWhatYouWishField from '../post/PayWhatYouWishField'
import { PRICE_DEFAULT, PRICE_MIN, PRICE_MAX } from '@/lib/constants'

describe('PayWhatYouWishField', () => {
  it('renders with default price', () => {
    render(<PayWhatYouWishField />)
    expect(screen.getByText(`$${PRICE_DEFAULT}`)).toBeInTheDocument()
  })

  it('shows the correct min and max in hint text', () => {
    render(<PayWhatYouWishField />)
    expect(screen.getByText(new RegExp(`\\$${PRICE_MIN}`))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`\\$${PRICE_MAX}`))).toBeInTheDocument()
  })

  it('calls onChange with cents when slider changes', () => {
    const onChange = vi.fn()
    render(<PayWhatYouWishField onChange={onChange} />)
    const slider = screen.getByRole('slider')
    fireEvent.change(slider, { target: { value: '150' } })
    expect(onChange).toHaveBeenCalledWith(15000)
  })

  it('clamps value to PRICE_MAX when input exceeds max', () => {
    const onChange = vi.fn()
    render(<PayWhatYouWishField onChange={onChange} />)
    const numberInput = screen.getByLabelText('Listing price in dollars')
    fireEvent.change(numberInput, { target: { value: '999' } })
    expect(onChange).toHaveBeenCalledWith(PRICE_MAX * 100)
  })

  it('clamps value to PRICE_MIN when input is below min', () => {
    const onChange = vi.fn()
    render(<PayWhatYouWishField onChange={onChange} />)
    const numberInput = screen.getByLabelText('Listing price in dollars')
    fireEvent.change(numberInput, { target: { value: '1' } })
    expect(onChange).toHaveBeenCalledWith(PRICE_MIN * 100)
  })
})
