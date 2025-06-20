import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/shared/lib/supabase";
import { useToastStore } from "@/stores/toastStore";
import {
  Button,
  Input,
  Card,
  Loader,
  Dialog,
  Label,
} from "@/shared/components/ui";
import { Phone, Sparkles, Lock, RectangleEllipsis } from "lucide-react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  inputPhoneStyle,
  buttonPhoneStyle,
  dropdownPhoneStyle,
} from "./utils/input-phone.style";

export function RegisterPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { addToast } = useToastStore();

  const inputStyle = inputPhoneStyle;
  const buttonStyle = buttonPhoneStyle;
  const dropdownStyle = dropdownPhoneStyle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword || !phoneNumber) {
      addToast("error", "Por favor, completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      addToast("error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        phone: `${phoneNumber}`,
        password,
      });

      if (error) throw error;

      addToast(
        "success",
        "¡Cuenta creada exitosamente! Por favor, inicia sesión."
      ); // # Quitar este toast cuando se quiera activar el dialogo de verificación

      // addToast(
      //   "success",
      //   "¡Cuenta creada exitosamente! Ingresa el código de verificación que te hemos enviado a tu número de celular."
      // ); # Quitar el comentario de este toast cuando se quiera activar el dialogo de verificación
      // setOpenCodeDialog(true); # Quitar el comentario de esta linea cuando se quiera activar el dialogo de verificación
      navigate("/login"); // # Quitar esta linea cuando se quiera activar el dialogo de verificación
    } catch (error) {
      addToast("error", "Error al crear la cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: `${phoneNumber}`,
        token: code,
        type: "sms",
      });

      if (error) {
        addToast("error", "Error al verificar OTP. Intenta nuevamente.");
        return;
      }

      addToast("success", "¡OTP verificado con éxito!");
      navigate("/login");
    } catch (error) {
      addToast("error", "Error al verificar OTP. Intenta nuevamente.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            StoryVerse
          </h1>
          <p className="text-gray-600 mt-2">
            Regístrate para empezar a crear historias
          </p>
        </div>

        <Card.Root className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 animate-slide-up">
          <Card.Header className="space-y-1 pb-6">
            <Card.Title className="text-2xl font-bold text-center text-gray-800">
              Crear Cuenta
            </Card.Title>
            <Card.Description className="text-center text-gray-600">
              Crea tu cuenta para empezar a crear historias
            </Card.Description>
          </Card.Header>
          <form onSubmit={handleSubmit}>
            <Card.Content className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Número de celular
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <PhoneInput
                    inputClass="green-input"
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
                    regions={["south-america"]}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-12 pr-12 pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirmar Contraseña
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-12 pr-12 pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                </div>
              </div>
            </Card.Content>
            <Card.Footer className="flex flex-col gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
              >
                {loading ? (
                  <Loader
                    size="sm"
                    message="Creando cuenta..."
                    variant="white"
                    textColor="white"
                  />
                ) : (
                  "Crear Cuenta"
                )}
              </Button>
              <p className="text-sm text-center text-gray-600">
                ¿Ya tienes una cuenta?{" "}
                <Button
                  variant="link"
                  className="p-0 font-medium text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                  onClick={() => navigate("/login")}
                >
                  Inicia sesión
                </Button>
              </p>
            </Card.Footer>
          </form>
        </Card.Root>

        <Dialog.Root open={openCodeDialog} onOpenChange={setOpenCodeDialog}>
          <Dialog.Content className="bg-white/80 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 animate-slide-up">
            <Dialog.Header className="space-y-1 pb-6">
              <Dialog.Title className="text-2xl font-bold text-center text-gray-800">
                Verifica tu celular
              </Dialog.Title>
            </Dialog.Header>
            <form onSubmit={handleVerifyCode} className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="code"
                  className="text-sm font-medium text-gray-700"
                >
                  Código de verificación
                </Label>
                <div className="relative">
                  <RectangleEllipsis className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="code"
                    name="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    placeholder="Ingresa el código recibido"
                    autoFocus
                    className="h-12 pl-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setOpenCodeDialog(false)}
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  Cerrar
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300"
                >
                  Verificar
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Root>
      </div>
    </div>
  );
}
