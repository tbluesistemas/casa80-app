'use client'

import { seedDatabase } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import styles from './seed-button.module.css'

export function SeedButton() {
    const handleSeed = async () => {
        toast.info('Iniciando seed...')
        const result = await seedDatabase()
        if (result.success) {
            toast.success(result.message || 'Seed completado')
        } else {
            toast.error(result.error)
        }
    }

    return (
        <Button variant="secondary" onClick={handleSeed} className={styles.button}>
            Poblar Base de Datos (Seed)
        </Button>
    )
}
