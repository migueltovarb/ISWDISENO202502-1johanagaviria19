
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Veterinaria vet = new Veterinaria();
        int opcion;

        do {
            System.out.println("\n===== SISTEMA DE SEGUIMIENTO VETERINARIO =====");
            System.out.println("1. Registrar nuevo dueño");
            System.out.println("2. Registrar nueva mascota");
            System.out.println("3. Registrar control veterinario");
            System.out.println("4. Consultar historial médico");
            System.out.println("5. Generar reporte general");
            System.out.println("0. Salir");
            System.out.print("Seleccione una opción: ");
            opcion = sc.nextInt();
            sc.nextLine();

            switch (opcion) {
                case 1:
                    System.out.print("Nombre del dueño: ");
                    String nd = sc.nextLine();
                    System.out.print("Documento: ");
                    String doc = sc.nextLine();
                    System.out.print("Teléfono: ");
                    String tel = sc.nextLine();
                    vet.registrarDueno(nd, doc, tel);
                    break;

                case 2:
                    System.out.print("Nombre de la mascota: ");
                    String nm = sc.nextLine();
                    System.out.print("Especie: ");
                    String esp = sc.nextLine();
                    System.out.print("Edad: ");
                    int edad = sc.nextInt();
                    sc.nextLine();
                    System.out.print("Documento del dueño: ");
                    String docD = sc.nextLine();
                    vet.registrarMascota(nm, esp, edad, docD);
                    break;

                case 3:
                    System.out.print("Nombre de la mascota: ");
                    String nombreM = sc.nextLine();
                    System.out.print("Fecha del control: ");
                    String fecha = sc.nextLine();
                    System.out.print("Tipo de control: ");
                    String tipo = sc.nextLine();
                    System.out.print("Observaciones: ");
                    String obs = sc.nextLine();
                    vet.registrarControl(nombreM, fecha, tipo, obs);
                    break;

                case 4:
                    System.out.print("Nombre de la mascota: ");
                    String buscar = sc.nextLine();
                    vet.mostrarHistorial(buscar);
                    break;

                case 5:
                    vet.generarReporte();
                    break;

                case 0:
                    System.out.println("👋 Saliendo del sistema...");
                    break;

                default:
                    System.out.println("❌ Opción inválida.");
            }
        } while (opcion != 0);

        sc.close();
    }
}
