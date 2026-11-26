import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Wrench, Clock, Banknote, Save,
} from 'lucide-react'

import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { PageHeader } from '../../components/ui/PageHeader'
import { Feedback } from '../../components/ui/Feedback'

import { createService } from '../../services/catalogService'

const initialForm = {
  name: '',
  description: '',
  duration: '',
  price: '',
}

type Field = keyof typeof initialForm

export function ServiceFormPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState(initialForm)

  const [errors, setErrors] =
    useState<Partial<Record<Field, string>>>({})

  const [message, setMessage] = useState('')

  function update(field: Field, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
    setMessage('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: Partial<Record<Field, string>> = {}

    const duration = Number(form.duration)
    const price = Number(form.price.replace(',', '.'))

    if (!form.name.trim()) {
      nextErrors.name = 'Informe o nome do serviço.'
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      nextErrors.duration = 'Informe uma duração inteira maior que zero.'
    }

    if (
      !form.price.trim() ||
      !Number.isFinite(price) ||
      price < 0
    ) {
      nextErrors.price = 'Informe um valor maior ou igual a zero.'
    }

    setErrors(nextErrors)
    setMessage('')

    if (Object.keys(nextErrors).length) return

    try {
      createService({
        name: form.name,
        description: form.description,
        durationMinutes: duration,
        referencePrice: price,
      })

      navigate('/admin/servicos', {
        replace: true,
        state: {
          success: 'Serviço cadastrado com sucesso!',
        },
      })
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Não foi possível cadastrar o serviço.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/admin/servicos"
        className="inline-flex items-center gap-2 text-sm text-primary">
        <ArrowLeft size={18} />
        Voltar à listagem
      </Link>

      <PageHeader
        title="Cadastrar serviço"
        description="Adicione um novo serviço ao catálogo."
        icon={<Wrench size={28} />}
      />

      <form noValidate onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-border
          bg-white p-6 shadow-sm md:p-8">

        <h2 className="flex items-center gap-2 border-b
          border-border pb-4 font-semibold text-primary">
          <Wrench size={20} />
          Informações do serviço
        </h2>

        <Input
          label="Nome do serviço"
          placeholder="Ex.: Manutenção preventiva"
          icon={<Wrench size={18} />}
          value={form.name}
          error={errors.name}
          onChange={(e) => update('name', e.target.value)}
          required
        />

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Descrição
          </label>

          <textarea
            id="description"
            rows={4}
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            placeholder="Descreva as atividades realizadas neste serviço..."
            className="w-full rounded-lg border border-gray-300
              p-3 text-sm"
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Duração estimada (minutos)"
            type="number"
            min={1}
            step={1}
            icon={<Clock size={18} />}
            placeholder="120"
            value={form.duration}
            error={errors.duration}
            onChange={(e) => update('duration', e.target.value)}
            required
          />

          <Input
            label="Valor de referência (R$)"
            type="text"
            inputMode="decimal"
            icon={<Banknote size={18} />}
            placeholder="250,00"
            value={form.price}
            error={errors.price}
            onChange={(e) => update('price', e.target.value)}
            required
          />
        </div>

        <Feedback message={message} type="error" />

        <div className="flex justify-end gap-3 border-t
          border-border pt-5">
          <Button variant="ghost"
            onClick={() => navigate('/admin/servicos')}>
            Cancelar
          </Button>
          <Button type="submit" icon={<Save size={18} />}>
            Cadastrar serviço
          </Button>
        </div>
      </form>
    </div>
  )
}
