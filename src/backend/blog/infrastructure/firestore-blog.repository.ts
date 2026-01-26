
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { BlogPost } from '../domain/blog.model';
import { BlogRepository } from '../domain/blog.repository';

export class FirestoreBlogRepository implements BlogRepository {
  private db = getFirestore();
  private collection = this.db.collection('blogPosts');

  private toDomain(doc: FirebaseFirestore.DocumentSnapshot): BlogPost {
    const data = doc.data()!;
    return {
      ...data,
      id: doc.id,
      publishedAt: (data.publishedAt as Timestamp).toDate(),
    } as BlogPost;
  }

  async findById(id: string): Promise<BlogPost | null> {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return this.toDomain(doc);
  }

  async findBySlug(slug: string, lang: string): Promise<BlogPost | null> {
    const snapshot = await this.collection.where(`slug.${lang}`, '==', slug).limit(1).get();
    if (snapshot.empty) {
      return null;
    }
    return this.toDomain(snapshot.docs[0]);
  }

  async findAll(): Promise<BlogPost[]> {
    const snapshot = await this.collection.orderBy('publishedAt', 'desc').get();
    return snapshot.docs.map(doc => this.toDomain(doc));
  }

  async save(post: BlogPost): Promise<void> {
    await this.collection.doc(post.id).set(post);
  }

  async update(post: Partial<BlogPost> & { id: string }): Promise<void> {
    const { id, ...postData } = post;
    await this.collection.doc(id).update(postData);
  }

  async delete(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
