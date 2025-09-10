// export class TokenType {
//     static readonly RESERVADA = 'RESERVADA'
//     static readonly TIPO = 'TIPO'
//     static readonly IDENTIFICADOR = 'IDENTIFICADOR'
//     static readonly LITERAL = 'LITERAL'
//     static readonly OPERADOR = 'OPERADOR'
//     static readonly COMENTARIO = 'COMENTARIO'
//     static readonly SEPARADOR = 'SEPARADOR'
//     static readonly DESCONOCIDO = 'DESCONOCIDO'

//     static readonly valores: Set<string> = new Set([
//         TokenType.RESERVADA,
//         TokenType.TIPO,
//         TokenType.IDENTIFICADOR,
//         TokenType.LITERAL,
//         TokenType.OPERADOR,
//         TokenType.COMENTARIO,
//         TokenType.SEPARADOR,
//         TokenType.DESCONOCIDO,
//     ])

//     // Prevent instantiation since this is a static class
//     private constructor() {}
// }

// class IllegalArgumentException extends Error {
//     constructor(message: string) {
//         super(message)
//     }
// }

// class ErrorType extends Error {
//     constructor(message: string) {
//         super(message)
//     }
// }

// /*
// package com.tokens;

// import java.util.HashSet;
// import java.util.List;

// public class Token {

//     private final String valor;
//     private final String tipo;

//     public Token(String valor, String tipo) throws IllegalArgumentException {
//         if (!TokenType.valores.contains(tipo)) {
//             throw new IllegalArgumentException("Tipo no valido: " + tipo);
//         }
//         this.valor = valor;
//         this.tipo = tipo;
//     }

//     public String getValor() {
//         return valor;
//     }

//     public String getTipo() {
//         return tipo;
//     }
// }

// */

// export class Token {
//     private readonly valor: string
//     private readonly tipo: string

//     /**
//      * Esto es un comentario de prueba
//      * @throws IllegalArgumentException | ErrorType
//      */
//     constructor(valor: string, tipo: string) {
//         if (!valor) {
//             throw new ErrorType('Valor no valido')
//         }
//         if (!TokenType.valores.has(tipo)) {
//             throw new IllegalArgumentException(`Tipo no valido: ${tipo}`)
//         }
//         this.valor = valor
//         this.tipo = tipo
//     }

//     getValor(): string {
//         return this.valor
//     }

//     getTipo(): string {
//         return this.tipo
//     }

//     // Optional: Add a toString() method for better string representation
//     toString(): string {
//         return `Token[tipo=${this.tipo}, valor=${this.valor}]`
//     }
// }

// let semicolon = false
// const tokens = new Set<Token>()

// if (semicolon) {
//     try {
//         tokens.add(new Token(';', TokenType.SEPARADOR))
//     } catch (e) {
//         // `e` de que tipo es ?
//         console.log('Error al agregar token: ' + e.message)
//     }
//     semicolon = false
// }
