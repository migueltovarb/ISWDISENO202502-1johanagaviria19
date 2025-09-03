package prueba;

import java.util.Scanner;

public class ControlAsistencia {
    // Constantes
    public static final int DIAS_SEMANA = 5;
    public static final int NUM_ESTUDIANTES = 4;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        char[][] asistencia = new char[NUM_ESTUDIANTES][DIAS_SEMANA];
        boolean datosIngresados = false;

        int opcion;
        do {
        	System.out.println("\n--------------------------------");
            System.out.println("      MENÚ DE OPCIONES");
            System.out.println("1. Registrar asistencia");
            System.out.println("2. Ver asistencia individual");
            System.out.println("3. Ver resumen general");
            System.out.println("4. Salir");
            System.out.print("Seleccione una opción: ");
            System.out.println("\n--------------------------------");
           
            opcion = leerEntero(sc); // ✅ lectura segura

            switch (opcion) {
                case 1:
                    registrarAsistencia(sc, asistencia);
                    datosIngresados = true;
                    break;

                case 2:
                    if (datosIngresados) {
                        verAsistenciaIndividual(asistencia);
                    } else {
                        System.out.println("⚠ Primero debe registrar asistencia.");
                    }
                    break;

                case 3:
                    if (datosIngresados) {
                        verResumenGeneral(asistencia);
                    } else {
                        System.out.println("⚠ Primero debe registrar asistencia.");
                    }
                    break;

                case 4:
                    System.out.println("Saliendo del sistema...");
                    break;

                default:
                    System.out.println("Opción inválida. Intente de nuevo.");
            }
        } while (opcion != 4);

        sc.close();
    }

    // 🔹 Método seguro para leer enteros
    public static int leerEntero(Scanner sc) {
        while (!sc.hasNextInt()) {
            System.out.print("Entrada inválida. Ingrese un número: ");
            sc.next(); // descartar lo que escribió
        }
        return sc.nextInt();
    }

    // Registrar asistencia (usuario elige estudiante y día)
    public static void registrarAsistencia(Scanner sc, char[][] asistencia) {
        int estudiante, dia;
        char valor;

        do {
            System.out.print("\nIngrese número de estudiante (1-" + NUM_ESTUDIANTES + ", 0 para salir): ");
            estudiante = leerEntero(sc); // ✅ lectura segura
            if (estudiante == 0) break;

            if (estudiante < 1 || estudiante > NUM_ESTUDIANTES) {
                System.out.println("Número inválido.");
                continue;
            }

            System.out.print("Ingrese número de día (1-" + DIAS_SEMANA + "): ");
            dia = leerEntero(sc); // ✅ lectura segura

            if (dia < 1 || dia > DIAS_SEMANA) {
                System.out.println("Número de día inválido.");
                continue;
            }

            do {
                System.out.print("Asistencia Estudiante " + estudiante + " Día " + dia + " (P = presente, A = ausente): ");
                String entrada = sc.next().toUpperCase();
                valor = entrada.charAt(0);
            } while (valor != 'P' && valor != 'A');

            asistencia[estudiante - 1][dia - 1] = valor;
            System.out.println("✔ Registro guardado.");
        } while (true);
    }

    // Ver asistencia de cada estudiante
    public static void verAsistenciaIndividual(char[][] asistencia) {
        for (int i = 0; i < NUM_ESTUDIANTES; i++) {
            System.out.print("Estudiante " + (i + 1) + ": ");
            for (int j = 0; j < DIAS_SEMANA; j++) {
                char estado = (asistencia[i][j] == 0) ? '-' : asistencia[i][j];
                System.out.print(estado + " ");
            }
            System.out.println();
        }
    }

    // Ver resumen general
    public static void verResumenGeneral(char[][] asistencia) {
        System.out.println("\n===== RESUMEN GENERAL =====");

        // Total de asistencias por estudiante
        for (int i = 0; i < NUM_ESTUDIANTES; i++) {
            int totalPresente = 0;
            for (int j = 0; j < DIAS_SEMANA; j++) {
                if (asistencia[i][j] == 'P') totalPresente++;
            }
            System.out.println("Estudiante " + (i + 1) + ": " + totalPresente + " asistencias");
        }

        // Estudiantes con asistencia perfecta
        System.out.print("\nEstudiantes con asistencia perfecta: ");
        boolean ninguno = true;
        for (int i = 0; i < NUM_ESTUDIANTES; i++) {
            boolean perfecto = true;
            for (int j = 0; j < DIAS_SEMANA; j++) {
                if (asistencia[i][j] != 'P') {
                    perfecto = false;
                    break;
                }
            }
            if (perfecto) {
                System.out.print("Estudiante " + (i + 1) + " ");
                ninguno = false;
            }
        }
        if (ninguno) System.out.print("Ninguno");
        System.out.println();

        // Días con mayor número de ausencias
        int[] ausenciasPorDia = new int[DIAS_SEMANA];
        for (int j = 0; j < DIAS_SEMANA; j++) {
            for (int i = 0; i < NUM_ESTUDIANTES; i++) {
                if (asistencia[i][j] == 'A') ausenciasPorDia[j]++;
            }
        }

        int maxAusencias = 0;
        for (int val : ausenciasPorDia) {
            if (val > maxAusencias) maxAusencias = val;
        }

        System.out.print("Día(s) con más ausencias: ");
        for (int j = 0; j < DIAS_SEMANA; j++) {
            if (ausenciasPorDia[j] == maxAusencias && maxAusencias > 0) {
                System.out.print((j + 1) + " ");
            }
        }
        if (maxAusencias == 0) System.out.print("Ninguno");
        System.out.println();
    }
}


