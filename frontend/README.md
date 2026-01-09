# Documentación de Testing - Frontend

Este proyecto utiliza **Vitest** como framework de pruebas y **React Testing Library** para probar componentes de React.

## Estructura de Tests

Los archivos de test se encuentran centralizados en `src/tests`.

- **Ubicación**: `src/tests/`

### Tests Actuales
*   `ConfirmModal.test.tsx`: Verifica la apertura, cierre y callbacks del modal.
*   `ToastNotification.test.tsx`: Verifica renderizado condicional de variantes (éxito, error, etc.) y props.
*   `ProductCard.test.tsx`: Verifica lógica de presentación de productos, descuentos y fallbacks de imágenes.

## Requisitos Previos

Instalar las dependencias del proyecto:

```bash
npm install
```

## Comandos Disponibles

Ejecutar los tests utilizando los siguientes scripts configurados en `package.json`:

### 1. Modo Watch (Desarrollo)
Ejecuta los tests y se mantiene escuchando cambios en los archivos.

```bash
npm test
# o
npx vitest
```

### 2. Ejecución Única (CI/CD)
Ejecuta todos los tests una sola vez y termina.

```bash
npm run test:run
# o
npx vitest run
```

### 3. Interfaz Gráfica (UI)
Abre una interfaz web interactiva para ver los resultados de los tests, gráficos y logs.

```bash
npm run test:ui
```

### 4. Cobertura de Código (Coverage)
Genera un reporte de qué porcentaje del código está cubierto por los tests.

```bash
npm run test:coverage
```





