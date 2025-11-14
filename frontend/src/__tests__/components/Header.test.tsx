import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { Header } from '../../components/Header/header'

import { useAuthContext } from '../../context/AuthContext'
import { useCartContext } from '../../context/CartContext'
import { useSearch } from '../../context/SearchContext'
import { useTheme } from '../../context/ThemeContext'

vi.mock('../../context/AuthContext')
vi.mock('../../context/CartContext')
vi.mock('../../context/SearchContext')
vi.mock('../../context/ThemeContext')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>()
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const mockedUseAuth = vi.mocked(useAuthContext)
const mockedUseCart = vi.mocked(useCartContext)
const mockedUseSearch = vi.mocked(useSearch)
const mockedUseTheme = vi.mocked(useTheme)

const renderHeader = () => {
  render(
    <BrowserRouter>
      <Header />
    </BrowserRouter>
  )
}

describe('Componente Header', () => {
  

    beforeEach(() => {
    vi.clearAllMocks()

    mockedUseAuth.mockReturnValue({
      isAuthenticated: false,
      user: null,
      loading: false,
    } as any) 

    mockedUseCart.mockReturnValue({
      itemCount: 0,
      openCart: vi.fn(),
    } as any)

    mockedUseSearch.mockReturnValue({
      openSearch: vi.fn(),
    } as any)

    mockedUseTheme.mockReturnValue({
      theme: 'light',
      toggleTheme: vi.fn(),
    } as any)
  })

  
  it('debería renderizar el rol de navegación', () => {
    renderHeader()
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })

  it('debería mostrar el nombre de la marca', () => {
    renderHeader()
    expect(screen.getAllByText('Concept & Hab')[0]).toBeInTheDocument()
  })

  it('no debería mostrar el contador del carrito si itemCount es 0', () => {
    renderHeader()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })


  it('debería mostrar el contador del carrito si itemCount es > 0', () => {
    mockedUseCart.mockReturnValue({
      itemCount: 5, 
      openCart: vi.fn(),
    } as any)

    renderHeader()

    const badges = screen.getAllByText('5')
    
    expect(badges[0]).toBeInTheDocument()
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('debería navegar a /login al hacer clic en (Cuenta) si no está logueado', () => {
    renderHeader()
    
    const userButtons = screen.getAllByLabelText('Cuenta')
    fireEvent.click(userButtons[0])
    
    expect(mockNavigate).toHaveBeenCalledWith('/login')
  })

  it('debería navegar a /account al hacer clic en (Cuenta) si SÍ está logueado', () => {
    mockedUseAuth.mockReturnValue({
      isAuthenticated: true,
      user: { id: 1, name: 'Lucho' }, 
      loading: false,
    } as any)
    
    renderHeader()

    const userButtons = screen.getAllByLabelText('Cuenta')
    fireEvent.click(userButtons[0])
    
    expect(mockNavigate).toHaveBeenCalledWith('/account')
  })


  it('debería llamar a openSearch al hacer clic en el ícono de búsqueda', () => {
    renderHeader()
    const searchButtons = screen.getAllByLabelText('Buscar')
    fireEvent.click(searchButtons[0])
    
    expect(mockedUseSearch().openSearch).toHaveBeenCalledTimes(1)
  })

  it('debería llamar a openCart al hacer clic en el ícono del carrito', () => {
    renderHeader()
    
    const cartButtons = screen.getAllByLabelText('Carrito')
    fireEvent.click(cartButtons[0])

    expect(mockedUseCart().openCart).toHaveBeenCalledTimes(1)
  })
  
  it('debería llamar a toggleTheme al hacer clic en el botón de tema', () => {
    renderHeader()
    
    const themeSwitches = screen.getAllByRole('switch')
    fireEvent.click(themeSwitches[0])

    expect(mockedUseTheme().toggleTheme).toHaveBeenCalledTimes(1)
  })
})