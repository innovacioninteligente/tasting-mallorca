'use client';

import { CheckCircle, Clock, Construction, Rocket, Milestone, QrCode } from 'lucide-react';

const phases = [
  {
    name: 'Fase 1: Fundación y Lanzamiento (Completado)',
    status: 'completed',
    milestones: [
      {
        name: 'Diseño de UI y Experiencia de Usuario (UX)',
        description: 'Creación de una interfaz clara, atractiva y fácil de usar, especialmente para personas mayores.',
        status: 'completed',
      },
      {
        name: 'Listado de Tours y Fichas de Detalle',
        description: 'Implementación de la visualización de los tours disponibles con imágenes, descripciones y precios.',
        status: 'completed',
      },
      {
        name: 'Soporte Multi-idioma (Frontend)',
        description: 'Componente para cambio de idioma y estructura preparada para la traducción de contenidos.',
        status: 'completed',
      },
      {
        name: 'Integración Inicial de Firestore',
        description: 'Configuración de la base de datos para almacenar y gestionar la información de los tours.',
        status: 'completed',
      },
    ],
  },
  {
    name: 'Fase 2: Funcionalidad Core de Reservas (Completado)',
    status: 'completed',
    milestones: [
      {
        name: 'Flujo de Reserva Simplificado',
        description: 'Proceso de reserva en 3 pasos: Tour -> Fecha/Idioma -> Pago. Conectado a una pasarela de pago segura (Stripe).',
        status: 'completed',
      },
      {
        name: 'Geocodificación de Puntos de Encuentro',
        description: 'Sistema que sugiere el punto de recogida más cercano basado en la ubicación del hotel del cliente.',
        status: 'completed',
      },
      {
        name: 'Página de Confirmación de Reserva',
        description: 'Página de éxito que muestra el resumen de la compra y próximos pasos.',
        status: 'completed',
      },
    ],
  },
  {
    name: 'Fase 3: Herramientas de Gestión y Optimización',
    status: 'todo',
    milestones: [
      {
        name: 'Panel de Administración Seguro (Admin Dashboard)',
        description: 'Interfaz para gestionar tours, precios, horarios, y contenidos en 6 idiomas de forma centralizada.',
        status: 'todo',
      },
      {
        name: 'Herramienta de Optimización de Rutas (IA)',
        description: 'Función para que los guías calculen la ruta de recogida más eficiente para cada día, minimizando tiempos.',
        status: 'todo',
      },
      {
        name: 'Sistema de Cuentas de Usuario',
        description: 'Portal para que los clientes vean su historial de reservas, gestionen sus datos y accedan a sus tickets.',
        status: 'todo',
      },
    ],
  },
  {
    name: 'Fase 4: Crecimiento y Experiencia de Usuario',
    status: 'todo',
    milestones: [
      {
        name: 'Sistema de Reseñas y Valoraciones',
        description: 'Permitir a los usuarios dejar valoraciones y comentarios después de un tour para generar confianza y feedback.',
        status: 'todo',
      },
      {
        name: 'Blog y Contenido SEO',
        description: 'Desarrollo de un blog para publicar artículos sobre Mallorca y mejorar el posicionamiento en buscadores.',
        status: 'todo',
      },
    ],
  },
  {
    name: 'Fase 5: Sistema de Moneda Dinámico',
    status: 'todo',
    milestones: [
      {
        name: 'Definir Estrategia de Precios y Monedas',
        description: 'Establecer el Euro (EUR) como precio base y asignar monedas secundarias (ej. GBP) según el idioma del usuario.',
        status: 'todo',
      },
      {
        name: 'Integración con API de Tasas de Cambio',
        description: 'Conectar con una API para obtener tasas de cambio actualizadas y cachearlas para optimizar el rendimiento.',
        status: 'todo',
      },
      {
        name: 'Lógica de Conversión y Visualización',
        description: 'Crear un hook y un proveedor de contexto en React para mostrar los precios convertidos y formateados correctamente.',
        status: 'todo',
      },
      {
        name: 'Integración Segura con Pasarela de Pago',
        description: 'Asegurar que, aunque los precios se muestren en varias monedas, el pago final se procese siempre en EUR.',
        status: 'todo',
      },
    ],
  },
  {
    name: 'Fase 6: Ticket Inteligente y Gestión de Tours',
    status: 'todo',
    milestones: [
      {
        name: 'Generación de Ticket Digital con QR',
        description: 'Creación de un ticket digital único por reserva con un QR para validación. Se enviará por email y estará accesible desde la cuenta del usuario.',
        status: 'todo',
      },
      {
        name: 'Mapa con Ruta en Página de Confirmación',
        description: 'Integrar un mapa de Google Maps en la página del ticket que muestre la ruta desde el hotel del cliente hasta el punto de encuentro.',
        status: 'todo',
      },
      {
        name: 'Web-App para Guías (Validación de Tickets)',
        description: 'App sencilla para que los guías escaneen los QR, validen los tickets y lleven un control de asistencia en tiempo real.',
        status: 'todo',
      },
      {
        name: 'Automatización Post-Tour',
        description: 'Sistema que envía un email de agradecimiento y una solicitud de reseña al cliente una vez el tour ha finalizado.',
        status: 'todo',
      },
    ],
  },
];

const statusIcons = {
  completed: <CheckCircle className="h-6 w-6 text-green-500" />,
  'in-progress': <Construction className="h-6 w-6 text-yellow-500 animate-pulse" />,
  todo: <Clock className="h-6 w-6 text-gray-500" />,
};

const phaseIcons = {
  'Fase 1: Fundación y Lanzamiento (Completado)': <Rocket className="h-8 w-8" />,
  'Fase 2: Funcionalidad Core de Reservas (Completado)': <Rocket className="h-8 w-8" />,
  'Fase 3: Herramientas de Gestión y Optimización': <Milestone className="h-8 w-8" />,
  'Fase 4: Crecimiento y Experiencia de Usuario': <Milestone className="h-8 w-8" />,
  'Fase 5: Sistema de Moneda Dinámico': <Milestone className="h-8 w-8" />,
  'Fase 6: Ticket Inteligente y Gestión de Tours': <QrCode className="h-8 w-8" />,
}

const statusText = {
  completed: 'Completado',
  'in-progress': 'En Progreso',
  todo: 'Pendiente',
};

export default function RoadMapPage() {
  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <Rocket className="mx-auto h-16 w-16 text-primary mb-4" />
          <h1 className="text-5xl md:text-6xl font-bold font-headline">Nuestra Hoja de Ruta</h1>
          <p className="mt-4 text-xl text-muted-foreground max-w-3xl mx-auto">
            Creemos en la transparencia. Aquí puedes ver el progreso de nuestra plataforma y las futuras características que estamos construyendo para mejorar tu experiencia.
          </p>
        </div>

        <div className="relative">
          {/* Central timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 h-full w-0.5 bg-primary/20 -translate-x-1/2"></div>
          
          {phases.map((phase, phaseIndex) => (
            <div key={phase.name} className="relative mb-12">
              <div className="absolute -left-[6px] md:left-1/2 md:-translate-x-1/2 top-1 z-10">
                <div className="bg-primary text-primary-foreground rounded-full h-14 w-14 flex items-center justify-center ring-8 ring-background">
                  {phaseIcons[phase.name as keyof typeof phaseIcons] || <Milestone className="h-8 w-8" />}
                </div>
              </div>

              <div className={`flex flex-col md:flex-row items-center w-full ${phaseIndex % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                 {/* Empty div for spacing on one side */}
                <div className="w-full md:w-1/2"></div>
                
                 {/* Card content */}
                <div className="w-full md:w-1/2 px-4 md:px-8">
                  <div className="bg-card p-6 rounded-lg shadow-lg border border-border/50 ml-10 md:ml-0">
                    <h2 className="text-2xl font-bold font-headline text-primary mb-2 text-left">{phase.name}</h2>
                     <span className={`inline-flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full mb-4 ${
                       phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                       phase.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                     }`}>
                       {statusIcons[phase.status as keyof typeof statusIcons]}
                       {statusText[phase.status as keyof typeof statusText]}
                    </span>
                    <ul className="space-y-4 text-left">
                      {phase.milestones.map((milestone) => (
                        <li key={milestone.name} className="flex items-start gap-3">
                          <div>
                            {statusIcons[milestone.status as keyof typeof statusIcons]}
                          </div>
                          <div>
                            <h3 className="font-bold text-lg">{milestone.name}</h3>
                            <p className="text-muted-foreground text-sm">{milestone.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
