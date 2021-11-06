import { render, screen } from '@testing-library/react'
import { useQuery } from '@apollo/client'
import { StaticRouter } from 'react-router-dom'

import Header from './Header'

jest.mock('@apollo/client', () => ({
  __esModule: true,
  ...jest.requireActual('@apollo/client'),
  useQuery: jest.fn()
}))

describe("Header", () => {
  it('should render Proflie when connected', () => {
    useQuery.mockImplementation(() => ({ data: { isConnected: true, address: '0xaddress' } }))

    const context = {}
    render(
        <StaticRouter location={'/'} context={context}>
          <Header />
        </StaticRouter>
    )

    expect(screen.getByText('0xaddress')).toBeTruthy()
  })
  it('should render connect button when not connected', () => {
    useQuery.mockImplementation(() => ({ data: { isConnected: false, address: '0xaddress' } }))

    const context = {}
    render(
        <StaticRouter location={'/'} context={context}>
          <Header />
        </StaticRouter>
    )

    expect(screen.getByText('Connect')).toBeTruthy()
  })
});
