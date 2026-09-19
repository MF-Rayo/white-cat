# White and Dark Cat 

> **Nota de proyecto:** Este es un **proyecto personal experimental e incompleto**. Su único propósito es poner en práctica lo aprendido en **React** (Frontend) y **FastAPI** (Backend), explorando la integración de APIs, bases de datos asíncronas y consumo de datos.

**Demo:** [https://mf-rayo.github.io/white-cat/](https://mf-rayo.github.io/white-cat/#/dashboard)

---

## Objetivo del Proyecto

El objetivo principal de **White Cat** no es ser un producto comercial ni un servicio de noticias definitivo, sino servir como un **entorno de pruebas**:

* Consumo de APIs públicas y parseo de feeds RSS en segundo plano en un rango de 10 a 30 min.
* Manejo de estado, contextos y enrutamiento en **React**.
* Modelado y optimización de consultas asíncronas con **FastAPI** y **SQLAlchemy**.
* Despliegue continuo de SPA (Single Page Application) en GitHub Pages.

---

## Aviso Legal, Atribución y Fuentes (Fair Use Disclaimer)

**White Cat NO reclama autoría de ningún contenido periodístico.**

1. **Uso de Feeds RSS Públicos:** La información de noticias se extrae a través de los feeds RSS abiertos y públicos brindados por sitios de ciberseguridad como *BleepingComputer, The Hacker News, The Record*, entre otros.
2. **Formato de Presentación (Snippets):** La aplicación únicamente muestra un extracto o titular breve.
3. **Redirección Obligatoria:** Todos los elementos incluyen de manera clara y visible la **fuente original** y un enlace directo. La lectura completa del artículo **siempre ocurre en el sitio web del autor original**.
4. **Fines meramente educativos:** Este proyecto es sin fines de lucro. Si representas a alguno de los sitios web indexados y deseas que se remueva la vista previa de tus feeds, por favor abre un *Issue* en este repositorio y se eliminará de inmediato.

---

## Tecnologías en Práctica

Este repositorio representa el código del **Frontend**:

* **React + Vite**
* **Tailwind CSS** (Diseño de la interfaz)
* **pnpm** (Gestor de paquetes)

*El Backend asociado está construido con FastAPI, MySQL y SQLAlchemy Async.*

---

## Componentes

* [metricUI](https://www.metricui.com)
* [Lucide](https://lucide.dev/)
* [SeraUI](https://seraui.com/docs/login)

---

## Features

* [x] Estructura inicial de Dashboard y componentes UI.
* [x] Mapeo e integración de endpoints en React.
* [x] Manejo de errores.
* [x] Optimización de rendimiento y carga modular.
* [ ] Ajuste responsive completo.
* [x] Server Sent Events.