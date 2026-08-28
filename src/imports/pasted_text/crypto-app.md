Contexto: Soy un desarrollador que quiere crear una aplicación web educativa e interactiva para estudiar Criptografía Clásica, basada en el contenido del archivo Criptografia Clasica.pdf. El objetivo es que los usuarios puedan leer la teoría y, lo más importante, practicar con ejercicios generados dinámicamente a partir de los conceptos del documento.

Tarea: Debes generar el código completo de una aplicación web de una sola página (HTML, CSS y JavaScript) que cumpla con los siguientes requisitos. La aplicación debe ser autónoma, funcional y con un diseño óptimo y ligero.

Requisitos Funcionales de la Aplicación:
Estructura de la Interfaz (UI):

Panel de Teoría (Izquierda): Una zona que muestre el contenido del archivo PDF formateado. Debe ser navegable (con scroll) y permitir al usuario leer los conceptos.

Panel de Práctica (Derecha): Un espacio dedicado a la interacción y resolución de ejercicios.

Diseño: Debe ser "limpio" y "funcional", utilizando un esquema de colores que facilite la lectura (ej. fondo claro para la teoría y un tono ligeramente diferente para la práctica). Prioriza la usabilidad sobre la estética recargada.

Sistema de Ejercicios Interactivos:

Generación Aleatoria de Ejercicios: El sistema debe ser capaz de generar ejercicios prácticos basados en los conceptos clave del PDF. Los ejercicios deben incluir:

Cifrado y Descifrado César: Con desplazamiento variable y opción de usar clave (ejemplo de "César con clave").

Cifrado y Descifrado de Vigenère: Con una clave aleatoria o definida por el usuario.

Cifrado y Descifrado de Playfair: Generando una matriz 5x5 con una clave dada o aleatoria.

Cifrado y Descifrado de Hill (Digráfico): Generando una matriz clave 2x2 válida (con inversa en módulo 27) y mostrando los pasos del cálculo matricial.

Transposición por Columnas: Con un número de columnas aleatorio y una clave de permutación opcional.

Análisis de Frecuencia: Mostrar un ejercicio donde se presente un texto cifrado (de un cifrado monoalfabético o César) y el usuario deba identificar la correspondencia de letras.

Validación de Respuestas: La aplicación debe permitir al usuario ingresar su respuesta y verificar si es correcta, mostrando una retroalimentación inmediata ("Correcto", "Incorrecto", o "Pista").

Mostrar Solución: Debe haber una opción para que el usuario pueda ver la solución paso a paso del ejercicio.

Interactividad y Controles:

Selector de Tema: Un menú desplegable o una barra de navegación para que el usuario pueda elegir el tipo de ejercicio que quiere practicar (ej. "Práctica: Cifrado César", "Práctica: Cifrado de Vigenère", etc.).

Controles de Ejercicio: Botones claros para "Nuevo Ejercicio", "Comprobar", "Mostrar Solución" y "Pista".

Entrada de Datos: Campos de texto y botones intuitivos para que el usuario pueda introducir el mensaje, la clave o la respuesta.

Contenido y Datos:

La aplicación debe integrar los conceptos teóricos del PDF. Para ello, debes extraer y resumir la información clave de las siguientes secciones y usarlas para generar el contenido del panel de teoría y las descripciones de los ejercicios:

1.1.1. Un poco de historia (Escítala, Polybios, César, Alberti).

1.2.2. Estadísticas del lenguaje (frecuencias de letras).

1.3. Clasificación de los criptosistemas clásicos.

1.4.2. El cifrador del César.

1.4.4. Cifradores genéricos por sustitución.

1.5.1. Cifradores por homófonos de primer orden.

1.6.2. Cifrador de Vigenère.

1.6.4. Cifrador de Beaufort.

1.7.1. Cifrador de Playfair.

1.7.3. Cifrador de Hill.

1.8.1. Transposición por grupos.

1.8.3. Transposición por columnas.

Base de Datos de Ejemplos: Incluye ejemplos de texto en claro y cifrado del PDF para que el generador de ejercicios pueda usarlos. Por ejemplo: "VENI, VIDI, VINCI", "AL CESAR LO QUE ES DEL CESAR", "EL DISCO DE ALBERTI ES EL PRIMER CIFRADOR POLIALFABÉTICO CONOCIDO", etc.

Restricciones Técnicas:

Lenguajes: Solo HTML, CSS y JavaScript puro. No se deben usar frameworks o librerías externas (como React, Vue, Angular, o jQuery) para mantener la aplicación ligera y autónoma.

Alfabeto: La aplicación debe trabajar con el alfabeto español de 27 letras (A-Z + Ñ) como se describe en el PDF. Las operaciones se realizarán en módulo 27.

Rendimiento: La lógica de generación de ejercicios y cifrado/descifrado debe ser eficiente y no bloquear la interfaz de usuario.

Responsividad: La aplicación debe verse y funcionar correctamente en computadoras de escritorio y tablets. En pantallas muy pequeñas, se puede apilar el panel de teoría sobre el de práctica.

Instrucciones de Desarrollo:
Análisis del PDF: Lee y comprende a fondo los algoritmos descritos en el documento para poder implementarlos correctamente. Enfócate en las ecuaciones, las reglas de cifrado y los ejemplos.

Diseño de la Lógica (JavaScript):

Crea funciones modulares para cada uno de los cifrados (cesar, vigenere, playfair, hill, transposicion, etc.).

Implementa funciones para la generación de claves aleatorias (válidas para cada algoritmo).

Crea una función para el análisis de frecuencia que, dado un texto, devuelva un objeto con la cuenta de cada letra.

Diseño de la Interfaz (HTML/CSS):

Crea un layout claro con dos columnas principales.

Utiliza CSS para estilizar los elementos de forma atractiva y funcional. Puedes usar variables CSS para mantener un esquema de colores consistente.

Asegúrate de que los botones y campos de texto sean fáciles de usar.

Integración del Sistema de Ejercicios:

Conecta la lógica de cifrado con la interfaz. Por ejemplo, cuando el usuario pulse "Nuevo Ejercicio", la aplicación debe:

Generar un mensaje aleatorio o usar uno de la base de datos.
Seleccionar un algoritmo y generar una clave.
Calcular el resultado correcto (cifrado o descifrado).
Mostrar el enunciado al usuario.
Implementa la lógica de validación para comparar la respuesta del usuario con la solución correcta.

Ejemplo de Flujo de Trabajo Esperado:
El usuario abre la aplicación.

En el panel izquierdo, lee la introducción sobre el cifrado César.

En el panel derecho, selecciona "Práctica: Cifrado César" del menú.

Pulsa "Nuevo Ejercicio".

La aplicación genera: Mensaje: VINI, VIDI, VINCI., Clave (Desplazamiento): 3.

El usuario escribe su respuesta en el campo de texto: YLPL YLGL YLPFL.

Pulsa "Comprobar". La aplicación le indica: "¡Correcto!" y muestra una explicación breve.

El usuario decide practicar Vigenère, selecciona la opción del menú y repite el proceso.