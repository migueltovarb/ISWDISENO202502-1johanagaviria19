"use client"

import { useState, useMemo, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { apiGetUsers, apiSaveUser, apiDeleteUser, apiSetUserActive } from "@/lib/api"
import type { User } from "@/lib/types"
import { Search, Plus, Pencil, Trash2, Key } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function UsuariosPage() {
  const { user: currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [actionError, setActionError] = useState("")
  const [actionSuccess, setActionSuccess] = useState("")
  useEffect(() => {
    const run = async () => {
      setUsers(await apiGetUsers())
    }
    void run()
  }, [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    name: "",
    role: "cajero" as "admin" | "cajero",
    active: true,
  })
  const isUsernameValid = formData.username.length >= 4 && formData.username.length <= 20
  const isPasswordStrong = editingUser ? true : /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)

  const [newPassword, setNewPassword] = useState("")

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [users, searchQuery])

  const openCreateDialog = () => {
    setEditingUser(null)
    setFormData({ username: "", password: "", name: "", role: "cajero", active: true })
    setIsDialogOpen(true)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFormData({
      username: user.username,
      password: "",
      name: user.name,
      role: user.role,
      active: user.active,
    })
    setIsDialogOpen(true)
  }

  const openPasswordDialog = (user: User) => {
    setEditingUser(user)
    setNewPassword("")
    setIsPasswordDialogOpen(true)
  }

  const handleSave = async () => {
    const isUsernameValid = formData.username.length >= 4 && formData.username.length <= 20
    const isPasswordValid = editingUser ? true : /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(formData.password)
    if (!isUsernameValid || !isPasswordValid || !formData.name) return
    const user: User = {
      id: editingUser?.id || Date.now().toString(),
      username: formData.username,
      password: editingUser ? editingUser.password : formData.password,
      name: formData.name,
      role: formData.role,
      active: formData.active,
      createdAt: editingUser?.createdAt || new Date().toISOString(),
    }
    try {
      await apiSaveUser(user, !!editingUser)
      setUsers(await apiGetUsers())
      setIsDialogOpen(false)
      setActionError("")
      setActionSuccess(editingUser ? "Usuario actualizado" : "Usuario creado")
    } catch (e) {
      setActionSuccess("")
      setActionError("No se pudo guardar el usuario")
    }
  }

  const handlePasswordChange = async () => {
    if (editingUser && newPassword && /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)) {
      try {
        await apiSaveUser({ ...editingUser, password: newPassword }, true)
        setUsers(await apiGetUsers())
        setIsPasswordDialogOpen(false)
        setActionError("")
        setActionSuccess("Contraseña actualizada")
      } catch (e) {
        setActionSuccess("")
        setActionError("No se pudo cambiar la contraseña")
      }
    }
  }

  const handleDelete = async () => {
    if (userToDelete) {
      try {
        await apiDeleteUser(userToDelete.id)
        setUsers(await apiGetUsers())
        setUserToDelete(null)
        setActionError("")
        setActionSuccess("Usuario eliminado")
      } catch (e) {
        setActionSuccess("")
        setActionError("No se pudo eliminar el usuario")
      }
    }
  }

  const toggleActive = async (user: User) => {
    try {
      await apiSetUserActive(user.id, !user.active)
      setUsers(await apiGetUsers())
      setActionError("")
      setActionSuccess("Estado actualizado")
    } catch (e) {
      setActionSuccess("")
      setActionError("No se pudo actualizar el estado")
    }
  }

  const canDelete = (user: User) => {
    return user.id !== currentUser?.id
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Usuarios</h1>
            <p className="text-muted-foreground">Administra los usuarios del sistema</p>
          </div>
          <Button onClick={openCreateDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Usuario
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Usuarios</CardTitle>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuarios..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {actionError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{actionError}</AlertDescription>
              </Alert>
            )}
            {actionSuccess && (
              <Alert className="mb-4">
                <AlertDescription>{actionSuccess}</AlertDescription>
              </Alert>
            )}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No se encontraron usuarios
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "admin" ? "default" : "secondary"} className="capitalize">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.active ? "default" : "secondary"}>
                          {user.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Switch
                            checked={user.active}
                            disabled={!canDelete(user)}
                            onCheckedChange={() => toggleActive(user)}
                          />
                          <Button variant="ghost" size="icon" onClick={() => openPasswordDialog(user)}>
                            <Key className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openEditDialog(user)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => setUserToDelete(user)}
                            disabled={!canDelete(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</DialogTitle>
            <DialogDescription>
              {editingUser ? "Modifica los datos del usuario" : "Ingresa los datos del nuevo usuario"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nombre del usuario"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Nombre de usuario"
                disabled={!!editingUser}
              />
              {!isUsernameValid && (
                <p className="text-xs text-destructive">Debe tener entre 4 y 20 caracteres</p>
              )}
            </div>
            {!editingUser && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Contraseña inicial"
                />
                {!isPasswordStrong && (
                  <p className="text-xs text-destructive">Mínimo 8 caracteres, con al menos una mayúscula y un número</p>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value as "admin" | "cajero" })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="cajero">Cajero</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="active">Activo</Label>
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                !formData.name ||
                !isUsernameValid ||
                !isPasswordStrong
              }
            >
              {editingUser ? "Guardar Cambios" : "Crear Usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cambiar Contraseña</DialogTitle>
            <DialogDescription>Ingresa la nueva contraseña para {editingUser?.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nueva contraseña"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPasswordDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordChange} disabled={!/^(?=.*[A-Z])(?=.*\d).{8,}$/.test(newPassword)}>
              Cambiar Contraseña
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente al usuario "{userToDelete?.name}". Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
