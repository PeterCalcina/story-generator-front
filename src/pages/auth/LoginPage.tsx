import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase";
import { useAuthStore } from "@/stores/authStore";
import { useToastStore } from "@/stores/toastStore";
import { Button, Input, Card, Loader, Label } from "@/shared/components/ui";
import { Sparkles } from "lucide-react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { inputPhoneStyle, buttonPhoneStyle, dropdownPhoneStyle } from "./utils/input-phone.style";

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();
  const { addToast } = useToastStore();

  const from = location.state?.from?.pathname || "/";
  const inputStyle = inputPhoneStyle;
  const buttonStyle = buttonPhoneStyle;
  const dropdownStyle = dropdownPhoneStyle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!phoneNumber || !password) {
      addToast("warning", "Por favor completa todos los campos.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: `${phoneNumber}`,
        password,
      });

      if (error) throw error;

      setAuth(data.user, data.session.access_token);
      addToast("success", "¡Bienvenido! Has iniciado sesión correctamente.");
      navigate(from, { replace: true });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Error al iniciar sesión. Verifica tus credenciales.";
      addToast("error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            StoryVerse
          </h1>
          <p className="text-gray-600 mt-2">Donde las historias cobran vida</p>
        </div>
        <Card.Root className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 animate-slide-up">
          <Card.Header className="space-y-1 pb-6">
            <Card.Title className="text-2xl font-bold text-center text-gray-800">
              Iniciar Sesión
            </Card.Title>
            <Card.Description className="text-center text-gray-600">
              Ingresa a tu mundo de historias
            </Card.Description>
          </Card.Header>

          <form onSubmit={handleSubmit}>
            <Card.Content className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-gray-700"
                >
                  Número de celular
                </Label>
                <PhoneInput
                  value={phoneNumber}
                  onChange={(value) => setPhoneNumber(value)}
                  placeholder="Tu número de celular"
                  containerClass="h-12"
                  inputProps={{
                    required: true,
                    "aria-invalid": !phoneNumber ? true : false,
                    "aria-describedby": "phoneNumber-error",
                  }}
                  inputStyle={inputStyle}
                  buttonStyle={buttonStyle}
                  dropdownStyle={dropdownStyle}
                  country="pe"
                  onlyCountries={["bo", "ar", "cl", "co", "ec", "pe", "uy", "ve"]}
                />

              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  aria-invalid={!password ? true : false}
                  aria-describedby="password-error"
                  className="h-12 pr-12 border-gray-200 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300"
                />
              </div>
            </Card.Content>

            <Card.Footer className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                {loading ? (
                  <Loader
                    size="sm"
                    message="Iniciando sesión..."
                    variant="white"
                    textColor="white"
                  />
                ) : (
                  "Iniciar Sesión"
                )}
              </Button>

              <p className="text-sm text-gray-600">
                ¿No tienes una cuenta?{" "}
                <Button
                  variant="link"
                  className="font-medium text-purple-600 hover:text-purple-700 transition-colors duration-200"
                  onClick={() => navigate("/register")}
                >
                  Regístrate
                </Button>
              </p>
            </Card.Footer>
          </form>
        </Card.Root>
      </div>
    </div>
  );
}
