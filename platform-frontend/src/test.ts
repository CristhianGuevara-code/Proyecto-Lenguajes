// src/test.ts

import { authEduRuralApi } from "./core/api/auth.edurural.api";

authEduRuralApi.get('/guides')
  .then(res => console.log(res.data))
  .catch(err => console.error('Error al conectar:', err));
