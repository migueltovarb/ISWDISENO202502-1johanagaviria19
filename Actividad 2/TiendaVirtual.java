package prueba;

import java.util.Scanner;

public class TiendaVirtual {

    // Constantes de descuentos por tipo de producto
    public static final double DESCUENTO_ROPA = 0.10;       // 10%
    public static final double DESCUENTO_TECNOLOGIA = 0.05; // 5%
    public static final double DESCUENTO_ALIMENTOS = 0.02;  // 2%

    // Constante de descuento adicional por compras grandes
    public static final double DESCUENTO_ADICIONAL = 0.05;  // 5%
    public static final double UMBRAL_DESCUENTO = 500000;   // $500.000

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Ingrese el número de productos a comprar (mínimo 1): ");
        int numProductos = scanner.nextInt();

        // Validar que el número sea mínimo 1
        while (numProductos < 1) {
            System.out.print("Debe ingresar al menos 1 producto. Intente de nuevo: ");
            numProductos = scanner.nextInt();
        }

        // Vector para almacenar precios de los productos
        double[] precios = new double[numProductos];
        double totalSinDescuento = 0;
        double totalConDescuento = 0;

        int i = 0;
        while (i < numProductos) {
            System.out.println("\nProducto #" + (i + 1));

            // Limpiar buffer antes de leer texto
            scanner.nextLine();

            // Nombre del producto
            System.out.print("Ingrese el nombre del producto: ");
            String nombre = scanner.nextLine();

            // Tipo de producto
            System.out.print("Ingrese el tipo de producto (1: Ropa, 2: Tecnología, 3: Alimentos): ");
            int tipo = scanner.nextInt();

            // Precio
            System.out.print("Ingrese el precio del producto: ");
            double precio = scanner.nextDouble();

            precios[i] = precio; // Guardar en el vector
            totalSinDescuento += precio;

            // Aplicar descuento según tipo
            double precioConDescuento = precio;
            switch (tipo) {
                case 1: // Ropa
                    precioConDescuento -= precio * DESCUENTO_ROPA;
                    break;
                case 2: // Tecnología
                    precioConDescuento -= precio * DESCUENTO_TECNOLOGIA;
                    break;
                case 3: // Alimentos
                    precioConDescuento -= precio * DESCUENTO_ALIMENTOS;
                    break;
                default:
                    System.out.println("Tipo no válido. No se aplica descuento.");
                    break;
            }

            totalConDescuento += precioConDescuento;

            // Mostrar detalle del producto
            System.out.println("➡ Producto: " + nombre +
                               " | Precio original: $" + precio +
                               " | Precio con descuento: $" + precioConDescuento);

            i++;
        }

        // Aplicar descuento adicional si supera el umbral
        if (totalConDescuento > UMBRAL_DESCUENTO) {
            double descuentoExtra = totalConDescuento * DESCUENTO_ADICIONAL;
            totalConDescuento -= descuentoExtra;
            System.out.println("\n¡Felicidades! Se aplicó un descuento adicional del 5% por superar $" + UMBRAL_DESCUENTO);
        }

        // Calcular ahorro
        double ahorro = totalSinDescuento - totalConDescuento;

        // Mostrar resultados finales
        System.out.println("\n📌 Resumen de la compra:");
        System.out.println("Total sin descuento: $" + totalSinDescuento);
        System.out.println("Total con descuento: $" + totalConDescuento);
        System.out.println("Ahorro total: $" + ahorro);

        scanner.close();
    }
}

