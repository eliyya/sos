import { Bath, Bed, MapPin, Maximize2 } from 'lucide-react'
import { Card } from './Card'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export interface Property {
    id: number
    title: string
    location: string
    price: string
    type: string
    image: string
    beds: number
    baths: number
    sqft: number
}
export function PropertyCard(property: Property) {
    return (
        <Card key={property.id} className="group overflow-hidden">
            <div className="relative">
                <Image
                    src={property.image}
                    alt={property.title}
                    width={400}
                    height={400}
                    className={cn(
                        'h-64 w-full object-cover transition-transform duration-300',
                        'group-hover:scale-110',
                    )}
                />
                <div className="absolute top-4 right-4 rounded-full bg-yellow-500 px-4 py-1 font-semibold text-white">
                    {property.price}
                </div>
            </div>
            <div className="p-6">
                <h3 className="mb-2 text-xl font-semibold">{property.title}</h3>
                <div className="mb-4 flex items-center text-gray-500">
                    <MapPin className="mr-1 h-4 w-4" />
                    <span>{property.location}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                        <Bed className="mr-1 h-4 w-4" />
                        <span>{property.beds} beds</span>
                    </div>
                    <div className="flex items-center">
                        <Bath className="mr-1 h-4 w-4" />
                        <span>{property.baths} baths</span>
                    </div>
                    <div className="flex items-center">
                        <Maximize2 className="mr-1 h-4 w-4" />
                        <span>{property.sqft} sqft</span>
                    </div>
                </div>
            </div>
        </Card>
    )
}
