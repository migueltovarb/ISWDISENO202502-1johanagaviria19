
import java.util.ArrayList;
import java.util.List;

public class Mascota {
    private String nombre;
    private String especie;
    private int edad;
    private Dueno dueno;
    private List<ControlVeterinario> controles;

    public Mascota(String nombre, String especie, int edad, Dueno dueno) {
        this.nombre = nombre;
        this.especie = especie;
        this.edad = edad;
        this.dueno = dueno;
        this.controles = new ArrayList<>();
    }

    public String getNombre() {
        return nombre;
    }

    public Dueno getDueno() {
        return dueno;
    }

    public List<ControlVeterinario> getControles() {
        return controles;
    }

    public void agregarControl(ControlVeterinario control) {
        controles.add(control);
    }

    @Override
    public String toString() {
        return "Mascota: " + nombre + " (" + especie + "), Edad: " + edad +
               " | Dueño: " + dueno.getNombre() + " | Controles: " + controles.size();
    }
}
