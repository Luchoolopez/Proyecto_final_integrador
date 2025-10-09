import { Router } from "express";
import { readdirSync } from "fs";

const PATH_ROUTER = `${__dirname}`;
const router = Router();

const basenameNoExt = (fileName: string) => fileName.replace(/\.(ts|js)$/, "");
const cleanFileName = (base: string) => base.split(".")[0]!;

readdirSync(PATH_ROUTER)
  .filter((fileName) => /.+\.routes\.(ts|js)$/.test(fileName))
  .forEach((fileName) => {
    const base = basenameNoExt(fileName);   
    const mount = cleanFileName(base);     

    import(`./${base}`)
      .then((moduleRouter) => {
        const subRouter =
          moduleRouter.default ?? moduleRouter.router ?? moduleRouter.Router;

        if (!subRouter) {
          console.warn(`[routes] ./${base} no exporta un Router válido`);
          return;
        }

        router.use(`/api/${mount}`, subRouter);
        console.log(`[routes] Montado: /api/${mount} -> ./${base}`);
      })
      .catch((err) => {
        console.error(`[routes] Error importando ./${base}:`, err);
      });
  });

router.get("/health", (_req, res) => res.json({ ok: true }));

export { router };
