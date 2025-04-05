"use client"
import { useEffect, useState, useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import jsPDF from "jspdf"
import "../../../styles/resident/visits/QRCodeModal.css"

function QRCodeModal({ visit, onClose }) {
  const [qrValue, setQrValue] = useState("")
  const [timeLeft, setTimeLeft] = useState("")

  // Dentro del componente QRCodeModal, añadir una referencia al QR
  const qrRef = useRef(null)

  // Agregar estas funciones al inicio del componente
  function formatDate(dateTimeStr) {
    if (!dateTimeStr) return "N/A"

    // Si la fecha viene en formato ISO 8601 (con T), convertirla a objeto Date
    // Si viene en formato YYYY-MM-DDThh:mm (del input), mantenerla como está
    let date
    if (dateTimeStr.includes("T")) {
      date = new Date(dateTimeStr)
    } else {
      // Dividir la fecha y hora
      const [datePart, timePart] = dateTimeStr.split(" ")
      date = new Date(`${datePart}T${timePart || "00:00"}`)
    }

    // Formatear fecha para México (día/mes/año)
    return date.toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  function formatTime(dateTimeStr) {
    if (!dateTimeStr) return "N/A"

    // Si la fecha viene en formato ISO 8601 (con T), convertirla a objeto Date
    // Si viene en formato ISO 8601 (con T), convertirla a objeto Date
    // Si viene en formato YYYY-MM-DDThh:mm (del input), mantenerla como está
    let date
    if (dateTimeStr.includes("T")) {
      date = new Date(dateTimeStr)
    } else {
      // Dividir la fecha y hora
      const [datePart, timePart] = dateTimeStr.split(" ")
      date = new Date(`${datePart}T${timePart || "00:00"}`)
    }

    // Formatear hora para México (hora:minutos)
    return date.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    if (!visit) return

    // Si el QR ya viene en base64 desde el backend, usarlo directamente
    if (visit.qrCode && visit.qrCode.startsWith("data:image/")) {
      setQrValue(visit.qrCode)
    } else {
      // Crear un objeto con la información relevante de la visita
      const visitInfo = {
        id: visit.id,
        visitorName: visit.visitorName,
        dateTime: visit.dateTime,
        numPeople: visit.numPeople,
        password: visit.password,
        vehiclePlate: visit.vehiclePlate || "N/A",
        timestamp: new Date().toISOString(),
      }

      // Convertir a JSON y luego a string para el QR
      setQrValue(JSON.stringify(visitInfo))
    }

    // Actualizar el tiempo restante cada segundo
    const interval = setInterval(() => {
      const visitDate = new Date(visit.dateTime)
      const now = new Date()
      const diffMs = visitDate.getTime() - now.getTime()

      if (diffMs <= 0) {
        setTimeLeft("¡Es hora de la visita!")
        clearInterval(interval)
      } else {
        // Calcular horas, minutos y segundos
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
        const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000)

        setTimeLeft(`${diffHours}h ${diffMinutes}m ${diffSeconds}s`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [visit])

  // Reemplazar la función de impresión con la función para descargar PDF
  const downloadQRAsPDF = () => {
    if (!qrRef.current) return

    // Crear un nuevo documento PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Obtener el canvas del QR
    const canvas = qrRef.current.querySelector("canvas") || qrRef.current.querySelector("img")

    if (canvas) {
      // Convertir el canvas o imagen a una imagen de datos
      const imgData = canvas instanceof HTMLCanvasElement ? canvas.toDataURL("image/png") : canvas.src

      // Añadir título
      pdf.setFontSize(18)
      pdf.text("Código QR para Visita", 105, 20, { align: "center" })

      // Añadir la imagen del QR al PDF
      pdf.addImage(imgData, "PNG", 65, 30, 80, 80)

      // Añadir información de la visita
      pdf.setFontSize(12)
      pdf.text(`Visitante: ${visit.visitorName}`, 20, 130)
      pdf.text(`Fecha: ${formatDate(visit.dateTime)}`, 20, 140)
      pdf.text(`Hora: ${formatTime(visit.dateTime)}`, 20, 150)
      pdf.text(`Personas: ${visit.numPeople}`, 20, 160)
      pdf.text(`Contraseña: ${visit.password}`, 20, 170)
      if (visit.vehiclePlate) {
        pdf.text(`Placas: ${visit.vehiclePlate}`, 20, 180)
      }

      // Añadir nota al pie
      pdf.setFontSize(10)
      pdf.text("Este código QR es válido solo hasta 2 horas después de la hora programada.", 105, 200, {
        align: "center",
      })
      pdf.text("Muéstrelo al guardia para acceder.", 105, 206, { align: "center" })

      // Descargar el PDF
      pdf.save(`visita_${visit.visitorName.replace(/\s+/g, "_")}.pdf`)
    }
  }

  if (!visit) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Código QR para Visita</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body text-center">
            {/* Modificar la parte del render donde está el contenedor del QR */}
            <div className="qr-container" ref={qrRef}>
              {visit.qrCode && visit.qrCode.startsWith("data:image/") ? (
                <img src={visit.qrCode || "/placeholder.svg"} alt="Código QR" className="qr-image" />
              ) : (
                <QRCodeCanvas value={qrValue} size={250} level="H" includeMargin={true} renderAs="canvas" />
              )}
            </div>

            <div className="visit-info mt-3">
              <h6>{visit.visitorName}</h6>
              <p className="mb-1">
                <strong>Fecha:</strong> {formatDate(visit.dateTime)}
              </p>
              <p className="mb-1">
                <strong>Hora:</strong> {formatTime(visit.dateTime)}
              </p>
              <p className="mb-1">
                <strong>Personas:</strong> {visit.numPeople}
              </p>
              <p className="mb-1">
                <strong>Contraseña:</strong> {visit.password}
              </p>

              <div className="time-remaining mt-3">
                <p className="countdown">Tiempo restante: {timeLeft}</p>
              </div>

              <div className="qr-instructions mt-3">
                <p className="text-muted">
                  Este código QR es válido solo hasta 2 horas después de la hora programada. Muéstrelo al guardia para
                  acceder.
                </p>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {/* Modificar el botón de imprimir por el de descargar */}
            <button type="button" className="btn btn-primary" onClick={downloadQRAsPDF}>
              Descargar PDF
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QRCodeModal

