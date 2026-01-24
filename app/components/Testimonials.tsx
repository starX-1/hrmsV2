'use client'
import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const Testimonials = () => {
    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "HR Director",
            company: "TechCorp Inc.",
            content: "HRMS Pro revolutionized how we manage our 500+ employees. The automation features saved us 20 hours per week!",
            rating: 5,
            avatar: "SJ"
        },
        {
            name: "Michael Chen",
            role: "Operations Manager",
            company: "StartUpScale",
            content: "As a growing startup, we needed a flexible HR solution. HRMS Pro scaled perfectly with our team from 10 to 200 employees.",
            rating: 5,
            avatar: "MC"
        },
        {
            name: "Priya Patel",
            role: "CFO",
            company: "Global Retail Co.",
            content: "The analytics dashboard provided insights that helped us optimize workforce costs by 15% in the first quarter.",
            rating: 4,
            avatar: "PP"
        },
        {
            name: "David Wilson",
            role: "CEO",
            company: "InnovateLabs",
            content: "Security was our top concern. HRMS Pro's compliance features gave us peace of mind while maintaining efficiency.",
            rating: 5,
            avatar: "DW"
        }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    const next = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
        );
    };

    return (
        <section id="testimonials" className="py-16 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white border border-gray-200 mb-4">
                        <Quote className="w-4 h-4 mr-2" style={{ color: '#1a462b' }} />
                        <span className="text-sm font-medium" style={{ color: '#1a462b' }}>
                            Trusted by Industry Leaders
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Loved by HR Teams Worldwide
                    </h2>
                    <p className="text-lg text-gray-600">
                        See what our customers have to say about their experience.
                    </p>
                </div>

                {/* Testimonial Slider */}
                <div className="relative max-w-4xl mx-auto">
                    {/* Navigation Buttons */}
                    <button
                        onClick={prev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    <button
                        onClick={next}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>

                    {/* Testimonial Cards */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((testimonial, index) => (
                                <div key={index} className="w-full flex-shrink-0 px-4">
                                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                                        <div className="flex items-center mb-6">
                                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4" style={{ backgroundColor: '#1a462b', color: 'white' }}>
                                                {testimonial.avatar}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-600">{testimonial.role} • {testimonial.company}</p>
                                            </div>
                                        </div>

                                        <div className="flex mb-6">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                                />
                                            ))}
                                        </div>

                                        <blockquote className="text-lg text-gray-700 italic relative">
                                            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-gray-200" />
                                            &quot;{testimonial.content}&quot;
                                        </blockquote>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Dots Indicator */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-green-700 w-8' : 'bg-gray-300'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-16 pt-12 border-t border-gray-200">
                    <p className="text-center text-gray-500 text-sm mb-8">
                        Trusted by companies of all sizes
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {[
                            { name: "TechCorp", color: "#1a462b" },
                            { name: "StartUpScale", color: "#15803d" },
                            { name: "GlobalRetail", color: "#ca8a04" },
                            { name: "InnovateLabs", color: "#7c3aed" },
                            { name: "CloudSystems", color: "#dc2626" }
                        ].map((company, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-2" style={{ backgroundColor: company.color + '20' }}>
                                    <div className="font-bold" style={{ color: company.color }}>
                                        {company.name.charAt(0)}
                                    </div>
                                </div>
                                <span className="text-sm font-medium text-gray-700">{company.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;