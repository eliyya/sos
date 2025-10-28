# Investigación académica: Microcontroladores y su programación

# 3. Microcontroladores

## 3.1 Características generales

### 3.1.1 Introducción

Un **microcontrolador** es un circuito integrado que contiene en un solo chip una **unidad central de procesamiento (CPU)**, **memoria** (RAM y ROM) y **periféricos de entrada/salida (E/S)**.  
Su propósito es **controlar dispositivos electrónicos** de forma autónoma, como en sistemas embebidos (por ejemplo, un horno de microondas, un automóvil o un robot).

**Diferencia con un microprocesador:**

- El microprocesador necesita componentes externos (memoria RAM, ROM, etc.) para funcionar.
- El microcontrolador los incluye dentro del mismo chip, reduciendo costos, tamaño y consumo de energía.

### 3.1.2 Familias

Las familias de microcontroladores se clasifican según su **arquitectura, fabricante y conjunto de instrucciones**.  
Ejemplos comunes:

- **PIC (Microchip):** muy utilizados en educación y sistemas industriales simples.
- **AVR (Atmel, ahora Microchip):** base de los Arduino.
- **ARM Cortex-M (STMicroelectronics, NXP, etc.):** más potentes, usados en sistemas modernos.
- **8051 (Intel y derivados):** clásicos en sistemas embebidos básicos.

Cada familia posee su propio **ensamblador, arquitectura interna y herramientas de desarrollo**.

### 3.1.3 Ancho de buses

Los microcontroladores manejan tres buses principales:

- **Bus de datos:** transporta información (8, 16 o 32 bits).
- **Bus de direcciones:** indica la posición de memoria que se desea leer o escribir.
- **Bus de control:** coordina las operaciones del sistema.

El **ancho del bus** determina cuánta información puede procesarse por ciclo.  
Por ejemplo, un microcontrolador de 8 bits (como el PIC16F84) procesa datos de 8 bits a la vez, mientras que uno de 32 bits (como un STM32) puede hacerlo cuatro veces más rápido en una sola instrucción.

### 3.1.4 Memoria

Los microcontroladores integran varios tipos de memoria:

- **ROM / Flash:** almacena el programa permanentemente.
- **RAM:** guarda datos temporales mientras el programa se ejecuta.
- **EEPROM:** conserva información tras apagar el sistema (por ejemplo, configuraciones o calibraciones).

---

## 3.2 Circuitería alternativa para entrada/salida

### 3.2.1 Generalidades

Los puertos de entrada/salida (E/S) permiten que el microcontrolador se comunique con el mundo exterior.  
Sus pines pueden configurarse como:

- **Entrada digital o analógica:** para leer sensores, botones, etc.
- **Salida digital o PWM:** para controlar actuadores, LEDs o motores.

### 3.2.2 Displays, LED, LCD y otros dispositivos de visualización

- **LEDs:** muestran estados simples (encendido/apagado).
- **Displays de 7 segmentos:** útiles para mostrar números (por ejemplo, en relojes).
- **LCD (Liquid Crystal Display):** permiten visualizar texto e información más compleja.
- **OLED o TFT:** versiones más avanzadas y coloridas.

Para controlar estos dispositivos se emplean **drivers** o **protocolos de comunicación** como **I²C** o **SPI**.

### 3.2.3 Codificadores de posición

Los codificadores transforman movimiento mecánico en señales eléctricas que permiten medir **posición, velocidad o dirección**.  
Tipos principales:

- **Incrementales:** miden desplazamientos relativos.
- **Absolutos:** proporcionan la posición exacta.

Se utilizan ampliamente en motores, brazos robóticos y sistemas de control industrial.

---

# 4. Programación de microcontroladores

## 4.1 Modelo de programación

La programación de microcontroladores consiste en escribir el código que se grabará en su memoria interna.  
El proceso general incluye:

1. **Diseñar y escribir** el programa en C o ensamblador.
2. **Compilar y enlazar** el código.
3. **Cargar (programar)** el microcontrolador.
4. **Ejecutar y depurar** el programa en el entorno físico.

## 4.2 Estructura de los registros del CPU

Los **registros** son pequeñas memorias internas de alta velocidad dentro del CPU.  
Ejemplos comunes:

- **Acumulador (A):** guarda resultados temporales de operaciones.
- **Contador de programa (PC):** indica la siguiente instrucción a ejecutar.
- **Puntero de pila (SP):** administra las llamadas a subrutinas.
- **Registro de estado:** almacena banderas (flags) de resultado, como cero, acarreo o negativo.

Comprender los registros es esencial para la **programación en ensamblador**, ya que las instrucciones trabajan directamente sobre ellos.

## 4.3 Modos de direccionamiento

Los modos de direccionamiento indican cómo el CPU accede a los datos:

- **Inmediato:** el valor está dentro de la instrucción (`MOV A, #55h`).
- **Directo:** se accede a una dirección específica de memoria (`MOV A, 30h`).
- **Indirecto:** un registro contiene la dirección del dato (`MOV A, @R0`).
- **Relativo / absoluto:** usados en saltos y llamadas a subrutinas.

## 4.4 Conjunto de instrucciones

Cada familia de microcontroladores posee su propio conjunto de **instrucciones de máquina**, que permiten realizar:

- Transferencia de datos
- Operaciones aritméticas y lógicas
- Control de flujo (saltos, bucles)
- Manipulación de bits

Estas instrucciones constituyen la base del **lenguaje ensamblador**.

### 4.5 Lenguajes ensambladores

El **lenguaje ensamblador** traduce las instrucciones binarias del procesador a una forma legible por humanos.  
Ejemplo:

```asm
MOV A, #01h
ADD A, #02h
MOV P1, A
```
