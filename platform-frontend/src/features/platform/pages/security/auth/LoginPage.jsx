import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox,
  MDBIcon
} from 'mdb-react-ui-kit';

function LoginPage() {
  return (
    <>
      {/* Imagen de fondo ocupa todo el ancho */}
      <div
        style={{
          backgroundImage: "url('/banner.png')",
          height: '350px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
        }}
      ></div>

      {/* Contenedor que centra la tarjeta */}
      <MDBContainer className="d-flex justify-content-center">
        <MDBCard
          className="mb-5 p-4 shadow-5"
          style={{
            marginTop: '-100px',
            maxWidth: '500px',
            width: '100%',
            background: 'hsla(0, 0%, 100%, 0.80)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <MDBCardBody className="p-4 text-center">
            <h2 className="fw-bold text-4xl mb-4">Iniciar Sesión</h2>

            <MDBInput wrapperClass="mb-4" label="Correo electrónico" id="form1" type="email" />
            <MDBInput wrapperClass="mb-4" label="Contraseña" id="form2" type="password" />

            <div className="d-flex justify-content-center mb-4">
              <MDBCheckbox
                name="flexCheck"
                id="flexCheckDefault"
                label="Recordar nombre de usuario"
              />
            </div>

            <MDBBtn className="w-100 mb-4">Ingresar</MDBBtn>

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
