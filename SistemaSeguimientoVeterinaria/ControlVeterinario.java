
public class ControlVeterinario {
    private String fecha;
    private String tipoControl;
    private String observaciones;

    public ControlVeterinario(String fecha, String tipoControl, String observaciones) {
        this.fecha = fecha;
        this.tipoControl = tipoControl;
        this.observaciones = observaciones;
    }

    @Override
    public String toString() {
        return "Fecha: " + fecha + " | Tipo: " + tipoControl + " | Obs: " + observaciones;
    }
}
