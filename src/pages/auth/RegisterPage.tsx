import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/shared/lib/supabase'
import { useToastStore } from '@/stores/toastStore'
import { Button, Input, Card, Loader, Dialog, Label } from '@/shared/components/ui'

export function RegisterPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [openCodeDialog, setOpenCodeDialog] = useState(false)
  const [code, setCode] = useState('')
  const navigate = useNavigate()
  const { addToast } = useToastStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || !confirmPassword || !phone) {
      addToast('error', 'Por favor, completa todos los campos.')
      return
    }

    if (password !== confirmPassword) {
      addToast('error', 'Las contraseñas no coinciden')
      return
    }

    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        phone: `+591${phone}`,
        password,
      })

      if (error) throw error

      addToast('success', '¡Cuenta creada exitosamente! Por favor, verifica tu celular.')
      setOpenCodeDialog(true)
    } catch (error) {
      addToast('error', 'Error al crear la cuenta. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `+591${phone}`,
        token: code,  
        type: 'sms',
      });
  
      if (error) {
        addToast('error', 'Error al verificar OTP. Intenta nuevamente.')
        return
      }
  
      addToast('success', '¡OTP verificado con éxito!')
      navigate('/login')
    } catch (error) {
      addToast('error', 'Error al verificar OTP. Intenta nuevamente.')
    }
  }

  return (
    <>
      <Card.Root className="w-full max-w-md bg-white">
        <Card.Header>
          <h2 className="text-2xl font-bold text-center text-dark-blue">Crear Cuenta</h2>
        </Card.Header>
        <form onSubmit={handleSubmit}>
          <Card.Content className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Número de celular
              </label>
              <Input
                id="phone"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="Tu número de celular"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Contraseña
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>
          </Card.Content>
          <Card.Footer className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? <Loader size="sm" message="Creando cuenta..." /> : 'Crear Cuenta'}
            </Button>
            <p className="text-sm text-center text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Button
                variant="link"
                className="p-0"
                onClick={() => navigate('/login')}
              >
                Inicia sesión
              </Button>
            </p>
          </Card.Footer>
        </form>
      </Card.Root>

      <Dialog.Root open={openCodeDialog} onOpenChange={setOpenCodeDialog}>
        <Dialog.Content>
          <Dialog.Header>
            <Dialog.Title>Verifica tu celular</Dialog.Title>
          </Dialog.Header>
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <Label htmlFor="code">Código de verificación</Label>
              <Input
                id="code"
                name="code"
                value={code}
                onChange={e => setCode(e.target.value)}
                required
                placeholder="Ingresa el código recibido"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setOpenCodeDialog(false)}>
                Cerrar
              </Button>
              <Button type="submit" variant="success">
                Verificar
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </>
  )
} 