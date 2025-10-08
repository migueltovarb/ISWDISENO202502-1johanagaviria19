
import java.util.ArrayList;
import java.util.List;

public class Veterinaria {
    private List<Dueno> duenos;
    private List<Mascota> mascotas;

    public Veterinaria() {
        this.duenos = new ArrayList<>();
        this.mascotas = new ArrayList<>();
    }

    // Registrar nuevo dueño
    public void registrarDueno(String nombre, String documento, String telefono) {
        for (Dueno d : duenos) {
            if (d.getDocumento().equals(documento)) {
                System.out.println("❌ El dueño ya está registrado.");
                return;
            }
        }
        duenos.add(new Dueno(nombre, documento, telefono));
        System.out.println("✅ Dueño registrado correctamente.");
    }

    public Dueno buscarDueno(String documento) {
        for (Dueno d : duenos) {
            if (d.getDocumento().equals(documento)) return d;
        }
        return null;
    }

    // Registrar mascota
    public void registrarMascota(String nombre, String especie, int edad, String documentoDueno) {
        Dueno dueno = buscarDueno(documentoDueno);
        if (dueno == null) {
            System.out.println("❌ El dueño no existe.");
            return;
        }

        for (Mascota m : mascotas) {
            if (m.getNombre().equalsIgnoreCase(nombre) && m.getDueno().equals(dueno)) {
                System.out.println("❌ Ya existe una mascota con ese nombre para este dueño.");
                return;
            }
        }

        mascotas.add(new Mascota(nombre, especie, edad, dueno));
        System.out.println("✅ Mascota registrada correctamente.");
    }

    public Mascota buscarMascota(String nombre) {
        for (Mascota m : mascotas) {
            if (m.getNombre().equalsIgnoreCase(nombre)) return m;
        }
        return null;
    }

    // Registrar control veterinario
    public void registrarControl(String nombreMascota, String fecha, String tipo, String obs) {
        Mascota mascota = buscarMascota(nombreMascota);
        if (mascota == null) {
            System.out.println("❌ Mascota no encontrada.");
            return;
        }
        mascota.agregarControl(new ControlVeterinario(fecha, tipo, obs));
        System.out.println("✅ Control agregado correctamente.");
    }

    // Mostrar historial médico
    public void mostrarHistorial(String nombreMascota) {
        Mascota mascota = buscarMascota(nombreMascota);
        if (mascota == null) {
            System.out.println("❌ Mascota no encontrada.");
            return;
        }
        System.out.println("\n📋 Historial médico de " + mascota.getNombre() + ":");
        for (ControlVeterinario c : mascota.getControles()) {
            System.out.println(" - " + c);
        }
    }

    // Generar reporte general
    public void generarReporte() {
        System.out.println("\n📊 Reporte de Mascotas:");
        for (Mascota m : mascotas) {
            System.out.println(m);
        }
    }
}
