class ArticleModel {
  final int id;
  final String title;
  final String category; // 'Reproductive Health' | 'Nutrition & Fitness' | 'Mental Health' | 'AI Health Twin' | 'Pediatrics'
  final String readTime;
  final String author;
  final String date;
  final String summary;
  final String content;
  final bool isPublished;
  final int views;

  ArticleModel({
    required this.id,
    required this.title,
    required this.category,
    required this.readTime,
    required this.author,
    required this.date,
    required this.summary,
    required this.content,
    this.isPublished = true,
    this.views = 340,
  });

  factory ArticleModel.fromJson(Map<String, dynamic> json) {
    String formattedDate = '2026-09-18';
    if (json['date'] != null) {
      formattedDate = json['date'].toString();
    } else if (json['created_at'] != null) {
      formattedDate = json['created_at'].toString().split('T')[0];
    } else if (json['published_at'] != null) {
      formattedDate = json['published_at'].toString().split('T')[0];
    }

    final desc = json['description'] ?? json['summary'] ?? json['content'] ?? 'Health & clinical guidance article.';

    return ArticleModel(
      id: json['id'] is int ? json['id'] : int.tryParse(json['id'].toString()) ?? 0,
      title: json['title'] ?? 'Health Article',
      category: json['category'] ?? 'Reproductive Health',
      readTime: json['readTime'] ?? json['read_time'] ?? '4 min read',
      author: json['author'] ?? json['author_name'] ?? 'FemSphere Editorial Board',
      date: formattedDate,
      summary: desc,
      content: json['content'] ?? desc,
      isPublished: json['isPublished'] ?? json['is_published'] ?? true,
      views: json['views'] ?? 150,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'category': category,
      'readTime': readTime,
      'author': author,
      'date': date,
      'summary': summary,
      'content': content,
      'isPublished': isPublished,
      'views': views,
    };
  }

  ArticleModel copyWith({
    int? id,
    String? title,
    String? category,
    String? readTime,
    String? author,
    String? date,
    String? summary,
    String? content,
    bool? isPublished,
    int? views,
  }) {
    return ArticleModel(
      id: id ?? this.id,
      title: title ?? this.title,
      category: category ?? this.category,
      readTime: readTime ?? this.readTime,
      author: author ?? this.author,
      date: date ?? this.date,
      summary: summary ?? this.summary,
      content: content ?? this.content,
      isPublished: isPublished ?? this.isPublished,
      views: views ?? this.views,
    );
  }
}
