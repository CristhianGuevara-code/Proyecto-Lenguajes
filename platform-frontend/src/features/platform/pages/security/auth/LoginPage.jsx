import { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
} from 'mdb-react-ui-kit';
//import authEduRuralApi from '../api/authEduRuralApi'; // Asegúrate que la ruta sea correcta
import { authEduRuralApi } from '../../../../../core/api/auth.edurural.api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../stores/authStore';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);


  /*const handleLogin = async () => {
    try {
      const response = await authEduRuralApi.post('/auth/login', {
        email,
        password
      });

      const { token } = response.data;
      localStorage.setItem('token', token);
      console.log('Login exitoso');

      navigate('/dashboard'); // o cualquier página protegida que tengas 
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      alert('Credenciales inválidas');
    }
  };*/
  const handleLogin = async () => {
  const response = await login({ email, password });

  if (useAuthStore.getState().authenticated) {
    console.log('Login exitoso');
    navigate('/home'); // O a donde quieras redirigir
  } else {
    alert(response?.message || 'Error al iniciar sesión');
  }
};

  return (
    <>
      <div
        style={{
          backgroundImage: "url('/banner.png')",
          height: '350px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
        }}
      ></div>

      <MDBContainer className="d-flex justify-content-center">
        <MDBCard
          className="mb-5 p-4 shadow-5"
          style={{
            marginTop: '-100px',
            maxWidth: '500px',
            width: '100%',
            background: 'hsla(0, 0%, 100%, 0.80)',
            backdropFilter: 'blur(1px)',
          }}
        >
          <MDBCardBody className="p-4 text-center">
            <h2 className="fw-bold text-4xl mb-4">Iniciar Sesión</h2>

            <MDBInput
              wrapperClass="mb-4"
              label="Correo electrónico"
              id="form1"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MDBInput
              wrapperClass="mb-4"
              label="Contraseña"
              id="form2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="d-flex justify-content-center mb-4">
              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                label="Recordar nombre de usuario"
              />
            </div>

            <MDBBtn className="w-100 mb-4" onClick={handleLogin}>
              Ingresar
            </MDBBtn>

            <div className="text-center">
              <p>O regístrate con:</p>

              <MDBBtn tag="a" color="none" className="mx-2" style={{ color: '#1266f1' }}>
                <MDBIcon fab icon="facebook-f" size="sm" />
              </MDBBtn>
              <MDBBtn tag="a" color="none" className="mx-2" style={{ color: '#1266f1' }}>
                <MDBIcon fab icon="twitter" size="sm" />
              </MDBBtn>
              <MDBBtn tag="a" color="none" className="mx-2" style={{ color: '#1266f1' }}>
                <MDBIcon fab icon="google" size="sm" />
              </MDBBtn>
              <MDBBtn tag="a" color="none" className="mx-2" style={{ color: '#1266f1' }}>
                <MDBIcon fab icon="github" size="sm" />
              </MDBBtn>
            </div>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}

export default LoginPage;
