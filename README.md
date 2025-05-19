# 🧪 Prueba de Concepto: Chat en Tiempo Real con Salas (Socket.IO + Redis + MongoDB + Express)

## 📌 Objetivo

El objetivo de esta prueba de concepto es construir un sistema de chat en tiempo real que permita:

- Crear y unirse a **salas de conversación**.
- Persistir el historial de mensajes en **MongoDB**.
- Escuchar y transmitir mensajes en tiempo real usando **Socket.IO**.
- Sincronizar mensajes entre múltiples instancias del servidor mediante **Redis (Pub/Sub)**.
- Servir una interfaz web simple desde Express.

Esta arquitectura sirve como base para escalar hacia un sistema distribuido con **microservicios**.

---

## 🛠️ Tecnologías utilizadas

| Tecnología     | Uso en el proyecto |
|----------------|-------------------|
| **Express**    | Servidor HTTP para servir el cliente web y las rutas REST |
| **Socket.IO**  | Comunicación en tiempo real con WebSockets |
| **MongoDB**    | Base de datos para persistir salas y mensajes |
| **Redis**      | Sistema de mensajería Pub/Sub para comunicación entre procesos/microservicios |
| **HTML/CSS/JS**| Cliente web básico para interacción con el servidor |
| **PrimeNG** (opcional) | Para estilizar la interfaz si se usa Angular en el futuro |

---

## ⚙️ Estructura del Proyecto

```
chat/
├── src/
│   ├── index.ts          # Servidor principal con Express + Socket.IO
│   ├── redis.js          # Configuración de Redis (pub/sub)
│   ├── db.js             # Modelos de MongoDB (Message, Room)
├── public/
│   └── index.html        # Cliente web para probar la app
```

---

## 🚀 Flujo General

1. El usuario abre el cliente web (`index.html`).
2. Elige su nombre y el nombre de la sala a la que quiere unirse o crear.
3. Se conecta mediante **Socket.IO** al servidor Express.
4. El servidor:
   - Une al usuario a la sala indicada.
   - Envía el historial de mensajes desde MongoDB.
   - Si la sala no existe, la crea en la base de datos.
5. Cuando se envía un mensaje:
   - El cliente emite el mensaje por `chatMessage`.
   - El servidor:
     - Publica el mensaje por Redis (`pub.publish()`).
     - Lo guarda en MongoDB.
   - El suscriptor de Redis (`sub.subscribe()`) lo recibe y lo retransmite a todos los clientes de esa sala.

---

## 🧩 ¿Por qué usar Redis?

Redis se utiliza como un **canal de comunicación (Pub/Sub)** entre procesos/microservicios, y es clave por:

- 🔄 **Sincronización entre instancias**: si tienes varias instancias del backend (por escalado horizontal), Redis garantiza que todas puedan transmitir mensajes a todos los usuarios conectados.
- ⚡ **Alto rendimiento**: Redis es extremadamente rápido en operaciones en memoria.
- 🧵 **Desacoplamiento**: al usar Pub/Sub, separas la lógica de envío/recepción del mensaje del almacenamiento o negocio.
- 🧱 **Escalabilidad**: esencial en una arquitectura de microservicios donde el chat puede ser un servicio independiente.

---

## 🧠 Detalles técnicos importantes

### MongoDB

- Se utiliza para **persistir los mensajes** con campos como `user`, `message`, `room`, `timestamp`.
- También se almacenan las **salas existentes** para que el frontend las muestre.

### Socket.IO

- Permite una conexión WebSocket bidireccional.
- Usa `socket.join(room)` para agrupar clientes por sala.
- Eventos importantes:
  - `joinRoom`: el usuario entra en una sala.
  - `chatMessage`: el usuario envía un mensaje.
  - `chat-history`: el servidor envía mensajes antiguos.
  - `notification`: mensaje de notificación a otros usuarios.

### Redis

- Se configura como Publisher (`pub`) y Subscriber (`sub`).
- Almacena mensajes temporalmente para reenviarlos a través de la red.

---

## 🌐 Exposición en red local

El servidor Express escucha en `0.0.0.0:3000`, lo que permite acceder desde otros dispositivos en tu red local si conoces la IP local del servidor.

Por ejemplo:
```
http://192.168.1.100:3000
```

---

## ✅ Ventajas de esta arquitectura

- Separación de responsabilidades (persistencia, transmisión, interfaz).
- Fácil de escalar.
- Historial disponible.
- Interacción en tiempo real.
- Preparada para un entorno distribuido (microservicios).
- Puede integrarse con autenticación, notificaciones push, moderación, etc.

---

## 🧱 Recomendaciones para microservicios

Escalar esta solución con microservicios:

- **Microservicio de chat**: con Socket.IO + Redis.
- **Microservicio de persistencia**: guarda los mensajes en MongoDB.
- **Microservicio de salas**: gestiona las salas y usuarios.
- **API Gateway o BFF**: para unificar el acceso del frontend.