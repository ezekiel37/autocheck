import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  private readonly logger = new Logger(OffersService.name);

  constructor(
    @InjectRepository(Offer)
    private offersRepository: Repository<Offer>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    try {
      const offer = this.offersRepository.create({
        ...createOfferDto,
        validFrom: new Date(createOfferDto.validFrom),
        validTo: new Date(createOfferDto.validTo),
      });

      const savedOffer = await this.offersRepository.save(offer);
      this.logger.log(`Offer created with ID: ${savedOffer.id}`);
      return savedOffer;
    } catch (error) {
      this.logger.error(`Error creating offer: ${error.message}`);
      throw error;
    }
  }

  async findAll(): Promise<Offer[]> {
    return this.offersRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findActive(): Promise<Offer[]> {
    const now = new Date();
    return this.offersRepository.find({
      where: {
        isActive: true,
        validFrom: LessThanOrEqual(now),
        validTo: MoreThanOrEqual(now),
      },
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: string): Promise<Offer> {
    const offer = await this.offersRepository.findOne({
      where: { id }
    });

    if (!offer) {
      throw new NotFoundException(`Offer with ID ${id} not found`);
    }

    return offer;
  }

  async deactivate(id: string): Promise<Offer> {
    const offer = await this.findOne(id);
    offer.isActive = false;
    
    const updatedOffer = await this.offersRepository.save(offer);
    this.logger.log(`Offer ${id} deactivated`);
    return updatedOffer;
  }

  async activate(id: string): Promise<Offer> {
    const offer = await this.findOne(id);
    offer.isActive = true;
    
    const updatedOffer = await this.offersRepository.save(offer);
    this.logger.log(`Offer ${id} activated`);
    return updatedOffer;
  }
}