"use client"
import { useEffect, useState, useRef } from "react"
import { QRCodeCanvas } from "qrcode.react"
import jsPDF from "jspdf"
import axios from "axios"
import "../../../styles/resident/visits/QRCodeModal.css"
import { API_URL } from "../../../auth/IP"

function QRCodeModal({ visit, onClose }) {
  const [qrValue, setQrValue] = useState("")
  const [timeLeft, setTimeLeft] = useState("")
  const [scanCount, setScanCount] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

  // Function to check and update QR scan count
  const checkQRScanCount = async () => {
    if (!visit || !visit.id) return

    try {
      setIsLoading(true)
      const token = localStorage.getItem("token")
      const response = await axios.get(`${API_URL}/resident/visit/${visit.id}/qr-status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const { scanCount: currentScanCount = 0 } = response.data || {}
      setScanCount(currentScanCount)

      // If scan count is 2 or more, mark as expired
      if (currentScanCount >= 2) {
        setIsExpired(true)
      }
      setIsLoading(false)
    } catch (error) {
      console.error("Error checking QR scan count:", error)
      // If we can't check the scan count, assume it's valid
      setScanCount(0)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!visit) return

    // Check QR scan count
    checkQRScanCount()

    // If the QR already comes in base64 from the backend, use it directly
    if (visit.qrCode && visit.qrCode.startsWith("data:image/")) {
      setQrValue(visit.qrCode)
    } else {
      // Create an object with the relevant visit information
      const visitInfo = {
        id: visit.id,
        visitorName: visit.visitorName,
        dateTime: visit.dateTime,
        numPeople: visit.numPeople,
        password: visit.password,
        vehiclePlate: visit.vehiclePlate || "N/A",
        scanCount: scanCount, // Include current scan count
        timestamp: new Date().toISOString(),
      }

      // Convert to JSON and then to string for the QR
      setQrValue(JSON.stringify(visitInfo))
    }

    // Update the time remaining every second
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
  }, [visit, scanCount])

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
      pdf.text("Este código QR es válido solo para 2 escaneos.", 105, 200, {
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
            {isLoading ? (
              <div className="d-flex justify-content-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Cargando...</span>
                </div>
              </div>
            ) : isExpired ? (
              <div className="expired-qr-container">
                <div className="alert alert-danger">
                  <h4>¡Código QR Caducado!</h4>
                  <p>Este código QR ya ha sido escaneado 2 veces y ha caducado.</p>
                  <p>Por favor, genere un nuevo código QR si necesita acceso adicional.</p>
                </div>
              </div>
            ) : (
              <>
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
                  <p className="mb-1">
                    <strong>Escaneos realizados:</strong> {scanCount}/2
                  </p>

                  <div className="time-remaining mt-3">
                    <p className="countdown">Tiempo restante: {timeLeft}</p>
                  </div>

                  <div className="qr-instructions mt-3">
                    <p className="text-muted">
                      Este código QR es válido solo para 2 escaneos. Después de eso, caducará automáticamente.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            {!isExpired && !isLoading && (
              <button type="button" className="btn btn-primary" onClick={downloadQRAsPDF}>
                Descargar PDF
              </button>
            )}
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
