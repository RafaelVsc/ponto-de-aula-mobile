import { ZodError } from 'zod';

// Compat: zod v4 expõe .issues, mas @hookform/resolvers ainda lê .errors.
// Adiciona um getter para manter o resolver funcionando sem lançar exceções.
const proto = ZodError.prototype as ZodError & { errors?: unknown };

Object.defineProperty(proto, 'errors', {
  get() {
    return (this as ZodError).issues;
  },
  configurable: true,
});
